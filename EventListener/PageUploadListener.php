<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 06/06/2018
 */

namespace Octopouce\CmsBundle\EventListener;

use Octopouce\AdminBundle\Utils\FileUploader;
use Octopouce\CmsBundle\Entity\Page;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;

class PageUploadListener {

	private $uploader;

	public function __construct(FileUploader $uploader)
	{
		$this->uploader = $uploader;
		$uploader->setTargetDirectory('uploads/page');
	}

	public function postPersist(LifecycleEventArgs $args)
	{
		$entity = $args->getEntity();

		if (!$entity instanceof Page) {
			return;
		}

		$this->uploadFile($entity);
		$entityManager = $args->getObjectManager();
		$entityManager->flush();
	}

	public function preUpdate(PreUpdateEventArgs $args)
	{
		$entity = $args->getEntity();

		$this->uploadFile($entity);
	}

	public function postLoad(LifecycleEventArgs $args)
	{
		$entity = $args->getEntity();

		if (!$entity instanceof Page) {
			return;
		}

		$dir = $this->uploader->getTargetDirectory().'/'.$entity->getId();

		$seoOgImage = $entity->getSeoOgImage();

		if ($seoOgImage && file_exists($dir.'/'.$seoOgImage)) {
			$entity->setSeoOgImage(new File($dir.'/'.$seoOgImage));
		} else{
			$entity->setSeoOgImage(null);
		}
	}

	private function uploadFile($entity)
	{
		// upload only works for Page entities
		if (!$entity instanceof Page) {
			return;
		}

		$seoOgImage = $entity->getSeoOgImage();
		$seoTwitterImage = $entity->getSeoTwitterImage();

		// only upload new files
		if ($seoOgImage instanceof UploadedFile) {
			$imgName = $this->uploader->upload($seoOgImage, $this->uploader->getTargetDirectory().'/'.$entity->getId());
			$entity->setSeoOgImage($imgName);
		} elseif($seoOgImage instanceof File){
			$entity->setSeoOgImage($seoOgImage->getFilename());
		}

	}
}