<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Controller\Admin;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Octopouce\AdminBundle\Provider\Locale\LocaleProvider;
use Octopouce\AdminBundle\Utils\FileUploader;
use Octopouce\CmsBundle\Entity\Field;
use Octopouce\CmsBundle\Entity\Page;
use Octopouce\CmsBundle\Form\PageFieldType;
use Octopouce\CmsBundle\Form\PageType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @Route("/field")
 * @IsGranted("ROLE_SUPER_ADMIN")
 */
class FieldController extends AbstractController
{
	/**
	 * @Route("/", name="octopouce_cms_admin_field_index")
	 */
	public function index() : Response {
		$pages = $this->getDoctrine()->getRepository(Page::class)->findBy([], ['title' => 'asc']);

		return $this->render('@OctopouceCms/Admin/Field/index.html.twig', [
			'pages' => $pages
		]);
	}

	/**
	 * @Route("/{page}/edit", name="octopouce_cms_admin_field_edit")
	 */
	public function edit(Page $page, Request $request, LocaleProvider $locales) : Response
	{

		// add original fields for check if field is removed
		$originalFields = new ArrayCollection();
		foreach ($page->getFields() as $field) {
			$originalFields->add($field);
		}

		$originalFieldsCloned = new ArrayCollection();
		foreach ($page->getFields() as $field) {
			$originalFieldsCloned->set($field->getId(), clone $field);
		}

		$form = $this->createForm(PageFieldType::class, $page);


		$form->handleRequest($request);
		if ($form->isSubmitted() && $form->isValid()) {

			$em = $this->getDoctrine()->getManager();

			foreach ($page->getFields() as $key => $field) {
				$fieldExist = $em->getRepository( Field::class )->findOneBy( [
					'page' => $page,
					'slug' => $field->getSlug()
				] );
				if ( $fieldExist && $field->getId() != $fieldExist->getId() ) {
					$form->addError(new FormError('Slug '. $field->getSlug() .' is already used.'));
					$this->addFlash('error', 'Slug '. $field->getSlug() .' is already used.');
				}
			}

			if($form->isValid()) {

				// remove fields
				foreach ($originalFields as $field) {
					if (false === $page->getFields()->contains($field)) {

						// remove field pageTranslation
						if(count($locales->getLocales()) > 1) {
							foreach ( $page->getTranslations() as $pageTranslate ) {
								$fieldTranslate = $em->getRepository( Field::class )->findOneBy( [
									'pageTranslation' => $pageTranslate->getId(),
									'slug'            => $field->getSlug()
								] );
								if($fieldTranslate) {
									$em->remove($fieldTranslate);
								}

							}
						}

						// remove field page
						$em->remove($field);
					}
				}

				foreach ($page->getFields() as $key => $field) {
					$field->setPage($page);

					// clone field in pageTranslate
					if(count($locales->getLocales()) > 1) {
						foreach ($page->getTranslations() as $pageTranslate) {

							// check if a field already exist with slug and locale
							if($originalFieldsCloned->get($field->getId())) {
								$fieldTranslate = $em->getRepository(Field::class)->findOneBy([
									'pageTranslation' => $pageTranslate->getId(),
									'slug' => $originalFieldsCloned->get($field->getId())->getSlug()
								]);
							} else {
								$fieldTranslate = null;
							}

							if(isset($fieldTranslate) && $fieldTranslate) {
								$fieldTranslate->setName($field->getName());
								$fieldTranslate->setSlug($field->getSlug());
								$fieldTranslate->setType($field->getType());
								$fieldTranslate->setSort($field->getSort());
								$fieldTranslate->setPageTranslation($pageTranslate);
							} else {
								$fieldTranslate = new Field();
								$fieldTranslate->setName($field->getName());
								$fieldTranslate->setSlug($field->getSlug());
								$fieldTranslate->setType($field->getType());
								$fieldTranslate->setSort($field->getSort());
								$fieldTranslate->setPageTranslation($pageTranslate);
								$em->persist($fieldTranslate);
							}
						}
					}
				}

				$em->flush();

				$this->addFlash('success', 'page.edited');

				return $this->redirectToRoute('octopouce_cms_admin_field_edit', ['page' => $page->getId()]);
			}
		}

		return $this->render('@OctopouceCms/Admin/Field/edit.html.twig', [
			'page' => $page,
			'form' => $form->createView()
		]);
	}

}