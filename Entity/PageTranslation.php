<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;

/**
 * Page
 *
 * @ORM\Table(name="cms_page_translation")
 * @ORM\Entity()
 */
class PageTranslation
{
	use ORMBehaviors\Translatable\Translation;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="title", type="string", length=255)
	 */
	protected $title;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="slug", type="string", length=255)
	 */
	protected $slug;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_title", type="string", length=255, nullable=true)
	 */
	protected $seoTitle;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_description", type="text", nullable=true)
	 */
	protected $seoDescription;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="og_title", type="string", length=255, nullable=true)
	 */
	protected $ogTitle;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="og_description", type="text", nullable=true)
	 */
	protected $ogDescription;

	/**
	 * @var ArrayCollection
	 *
	 * @ORM\OneToMany(targetEntity="Octopouce\CmsBundle\Entity\PageBlock", mappedBy="pageTranslation", cascade={"persist", "remove"})
	 */
	private $blocks;

	/**
	 * @var ArrayCollection
	 *
	 * @ORM\OneToMany(targetEntity="Octopouce\CmsBundle\Entity\Field", mappedBy="pageTranslation", cascade={"persist", "remove"})
	 * @ORM\OrderBy({"sort" = "ASC"})
	 */
	private $fields;


	public function __toString() {
		return $this->getTitle();
	}

	public function getTitle() {
		return $this->title;
	}

	public function setTitle( $title ) {
		$this->title = $title;
	}

	public function getSlug() {
		return $this->slug;
	}

	public function setSlug( $slug ) {
		$this->slug = $slug;
	}

	public function getSeoTitle() {
		return $this->seoTitle;
	}

	public function setSeoTitle( $seoTitle ) {
		$this->seoTitle = $seoTitle;
	}

	public function getSeoDescription() {
		return $this->seoDescription;
	}

	public function setSeoDescription( $seoDescription ) {
		$this->seoDescription = $seoDescription;
	}

	public function getOgTitle() {
		return $this->ogTitle;
	}

	public function setOgTitle( $ogTitle ) {
		$this->ogTitle = $ogTitle;
	}

	public function getOgDescription() {
		return $this->ogDescription;
	}

	public function setOgDescription( $ogDescription ) {
		$this->ogDescription = $ogDescription;
	}

	public function getBlocks() {
		return $this->blocks;
	}

	public function addBlock(PageBlock $block)
	{
		if (!$this->blocks->contains($block)) {
			$block->setPageTranslation($this);
			$this->blocks->add($block);
		}

		return $this;
	}

	public function removeBlock(PageBlock $block)
	{
		return $this->blocks->removeElement($block);
	}

	public function getFields() {
		return $this->fields;
	}

	public function addField(Field $field)
	{
		if (!$this->fields->contains($field)) {
			$field->setPageTranslation($this);
			$this->fields->add($field);
		}

		return $this;
	}

	public function removeField(Field $field)
	{
		return $this->fields->removeElement($field);
	}

	public function setFields($fields) {
		$this->fields = $fields;

		return $this;
	}

}
