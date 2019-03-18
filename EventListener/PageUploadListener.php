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

		$ogImage = $entity->getOgImage();

		if ($ogImage && file_exists($ogImage)) {
			$entity->setOgImage(new File($ogImage));
		} else{
			$entity->setOgImage(null);
		}
	}

	private function uploadFile($entity)
	{
		// upload only works for Page entities
		if (!$entity instanceof Page) {
			return;
		}

		$ogImage = $entity->getOgImage();

		// only upload new files
		if ($ogImage instanceof UploadedFile) {
			$imgName = $this->uploader->upload($ogImage, 'date');
			$entity->setOgImage($imgName);
		} elseif($ogImage instanceof File){
			$entity->setOgImage($ogImage->getFilename());
		}

	}
}
