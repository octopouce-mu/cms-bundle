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
use Octopouce\CmsBundle\Form\PageFieldType;
use Octopouce\CmsBundle\Form\PageType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
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
	public function edit(Page $page, Request $request) : Response
	{

		$originalFields = new ArrayCollection();
		foreach ($page->getFields() as $field) {
			$originalFields->add($field);
		}

		$form = $this->createForm(PageFieldType::class, $page);


		$form->handleRequest($request);
		if ($form->isSubmitted() && $form->isValid()) {


//			foreach ($originalBlocks as $block) {
//				if (false === $page->getBlocks()->contains($block)) {
//					$em->remove($block);
//				}
//			}


			$this->getDoctrine()->getManager()->flush();

			$this->addFlash('success', 'page.edited');

			return $this->redirectToRoute('octopouce_cms_admin_field_edit', ['page' => $page->getId()]);
		}

		return $this->render('@OctopouceCms/Admin/Field/edit.html.twig', [
			'page' => $page,
			'form' => $form->createView()
		]);
	}

}