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

		$seoFacebookImage = $entity->getSeoFacebookImage();
		$seoTwitterImage = $entity->getSeoTwitterImage();

		if ($seoFacebookImage && file_exists($dir.'/'.$seoFacebookImage)) {
			$entity->setSeoFacebookImage(new File($dir.'/'.$seoFacebookImage));
		} else{
			$entity->setSeoFacebookImage(null);
		}

		if ($seoTwitterImage && file_exists($dir.'/'.$seoTwitterImage)) {
			$entity->setSeoTwitterImage(new File($dir.'/'.$seoTwitterImage));
		} else{
			$entity->setSeoTwitterImage(null);
		}
	}

	private function uploadFile($entity)
	{
		// upload only works for Page entities
		if (!$entity instanceof Page) {
			return;
		}

		$seoFacebookImage = $entity->getSeoFacebookImage();
		$seoTwitterImage = $entity->getSeoTwitterImage();

		// only upload new files
		if ($seoFacebookImage instanceof UploadedFile) {
			$imgName = $this->uploader->upload($seoFacebookImage, $this->uploader->getTargetDirectory().'/'.$entity->getId());
			$entity->setSeoFacebookImage($imgName);
		} elseif($seoFacebookImage instanceof File){
			$entity->setSeoFacebookImage($seoFacebookImage->getFilename());
		}

		if ($seoTwitterImage instanceof UploadedFile) {
			$imgName = $this->uploader->upload($seoTwitterImage, $this->uploader->getTargetDirectory().'/'.$entity->getId());
			$entity->setSeoTwitterImage($imgName);
		} elseif($seoTwitterImage instanceof File){
			$entity->setSeoTwitterImage($seoTwitterImage->getFilename());
		}

	}
}