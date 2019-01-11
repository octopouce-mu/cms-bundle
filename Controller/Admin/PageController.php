<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Controller\Admin;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Octopouce\AdminBundle\Utils\FileUploader;
use Octopouce\CmsBundle\Entity\Field;
use Octopouce\CmsBundle\Entity\Page;
use Octopouce\CmsBundle\Entity\PageTranslation;
use Octopouce\CmsBundle\Form\PageType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @Route("/page")
 * @IsGranted("ROLE_CMS")
 */
class PageController extends AbstractController
{
	/**
	 * @Route("/", name="octopouce_cms_admin_page_index")
	 */
	public function index() : Response {
		$pages = $this->getDoctrine()->getRepository(Page::class)->findBy([], ['title' => 'asc']);

		return $this->render('@OctopouceCms/Admin/Page/index.html.twig', [
			'pages' => $pages
		]);
	}

	/**
	 * @Route("/create", name="octopouce_cms_admin_page_create")
	 */
	public function create(Request $request) : Response {
		$em = $this->getDoctrine()->getManager();

		$page = new Page();
		$page->setEnabled(true);

		$form = $this->createForm(PageType::class, $page);

		$form->handleRequest($request);
		if ($form->isSubmitted() && $form->isValid()) {

			$em->persist($page);
			$em->flush();

			return $this->redirectToRoute('octopouce_cms_admin_page_edit', ['page'=>$page->getId()]);
		}

		return $this->render('@OctopouceCms/Admin/Page/create.html.twig', [
			'form' => $form->createView()
		]);
	}

	/**
	 * @Route("/{page}/edit", name="octopouce_cms_admin_page_edit")
	 */
	public function edit(Page $page, Request $request, EntityManagerInterface $em, FileUploader $fileUploader) : Response
	{

		$originalBlocks = new ArrayCollection();
		foreach ($page->getBlocks() as $block) {
			$originalBlocks->add($block);
		}

		$form = $this->createForm(PageType::class, $page, [
			'superadmin' => $this->isGranted('ROLE_SUPER_ADMIN'),
			'editable' => $page->isEditable()
		]);


		$form->handleRequest($request);
		if ($form->isSubmitted() && $form->isValid()) {


			foreach ($originalBlocks as $block) {
				if (false === $page->getBlocks()->contains($block)) {
					$em->remove($block);
				}
			}

			// reset input checkbox to null value
			$fieldsSwitch = $em->getRepository(Field::class)->findBy(['page' => $page, 'type' => 'switch']);
			if($fieldsSwitch) {
				foreach($fieldsSwitch as $field) {
					$field->setValue(null);
				}
			}

			foreach ($page->getTranslations() as $pageTranslation) {
				// reset input checkbox to null value
				$fieldsSwitch = $em->getRepository(Field::class)->findBy(['pageTranslation' => $pageTranslation, 'type' => 'switch']);
				if($fieldsSwitch) {
					foreach($fieldsSwitch as $field) {
						$field->setValue(null);
					}
				}
			}


			$fields = $request->request->get('fields');
			if($fields) {
				foreach ($fields as $id => $value) {
					$field = $em->getRepository(Field::class)->find($id);
					if($field->getType() != 'file') {

						// wysiwyg with value empty
						if($value == '<p>&nbsp;</p>') {
							$value = null;
						}

						$field->setValue($value);
					} else {
						if($field) {
							$field->setValue($value);
						}
					}
				}
			}


			$fields = $request->files->get('fields');
			if($fields) {
				foreach ($fields as $id => $value) {
					if($value) {
						$field = $em->getRepository(Field::class)->find($id);
						if($field) {
							$fileSystem = new Filesystem();

							if($field->getValue() && file_exists($field->getValue())) {
								$fileSystem->remove($field->getValue());
							}

							$nameImage = $fileUploader->upload($value, 'date');
							$field->setValue($nameImage);

						}
					}
				}
			}

			$em->flush();

			$this->addFlash('success', 'page.edited');

			return $this->redirectToRoute('octopouce_cms_admin_page_edit', ['page' => $page->getId()]);
		}

		return $this->render('@OctopouceCms/Admin/Page/edit.html.twig', [
			'page' => $page,
			'form' => $form->createView()
		]);
	}

	/**
	 * @Route("/{page}/delete", name="octopouce_cms_admin_page_delete")
	 */
	public function delete(Page $page) : Response {
		$em = $this->getDoctrine()->getManager();
		$em->remove($page);
		$em->flush();

		$this->addFlash('success', 'page.deleted');

		return $this->redirectToRoute('octopouce_cms_admin_page_index');
	}
}