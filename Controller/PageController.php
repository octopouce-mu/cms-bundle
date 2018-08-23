<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 01/06/2018
 */

namespace Octopouce\CmsBundle\Controller;

use Octopouce\CmsBundle\Entity\Page;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @Route("/")
 */
class PageController extends Controller
{
	/**
	 * @Route("/{slug}", name="octopouce_cms_page_show")
	 * @ParamConverter("page", class="OctopouceCmsBundle:Page")
	 */
	public function show(Page $page) : Response {

		if(!$page->isEnabled()){
			$this->denyAccessUnlessGranted(['ROLE_ADMIN', 'ROLE_CMS'], null, 'Unable to access this page!');
		}

		return $this->render('@OctopouceCms/Page/show.html.twig', [
			'page' => $page
		]);
	}
}