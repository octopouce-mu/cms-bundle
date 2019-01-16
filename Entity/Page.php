<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Octopouce\AdminBundle\Translatable\Translatable;

/**
 * Page
 *
 * @ORM\Table(name="cms_page")
 * @ORM\Entity()
 */
class Page
{
	use Translatable;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

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
	 * @var bool
	 *
	 * @ORM\Column(name="enabled", type="boolean")
	 */
	protected $enabled;

	/**
	 * @var bool
	 *
	 * @ORM\Column(name="editable", type="boolean")
	 */
	protected $editable;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="published_at", type="datetime")
	 */
	protected $publishedAt;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="finished_at", type="datetime", nullable=true)
	 */
	protected $finishedAt;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="created_at", type="datetime")
	 */
	protected $createdAt;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_title", type="string", length=255, nullable=true)
	 */
	protected $seoTitle;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_description", type="string", length=255, nullable=true)
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
	 * @ORM\Column(name="og_description", type="string", length=255, nullable=true)
	 */
	protected $ogDescription;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="og_image", type="string", length=255, nullable=true)
	 */
	protected $ogImage;

	/**
	 * @var ArrayCollection
	 *
	 * @ORM\OneToMany(targetEntity="Octopouce\CmsBundle\Entity\PageBlock", mappedBy="page", cascade={"persist", "remove"})
	 */
	private $blocks;

	/**
	 * @var Page
	 *
	 * @ORM\ManyToOne(targetEntity="Octopouce\CmsBundle\Entity\Page")
	 */
	private $parent;

	/**
	 * @var ArrayCollection
	 *
	 * @ORM\OneToMany(targetEntity="Octopouce\CmsBundle\Entity\Field", mappedBy="page", cascade={"persist", "remove"})
	 * @ORM\OrderBy({"sort" = "ASC"})
	 */
	private $fields;

	public function __toString() {
		return $this->getTitle();
	}

//	public function __call($method, $arguments)
//	{
//		return $this->proxyCurrentLocaleTranslation($method, $arguments);
//	}

	/**
	 * Page constructor.
	 */
	public function __construct() {
		$this->enabled     = false;
		$this->editable    = true;
		$this->publishedAt = new \DateTime('now');
		$this->createdAt   = new \DateTime('now');
		$this->fields      = new ArrayCollection();
		$this->blocks      = new ArrayCollection();
	}


	/**
	 * Get id
	 *
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set title
	 *
	 * @param string $title
	 *
	 * @return Page
	 */
	public function setTitle($title)
	{
		$this->title = $title;

		return $this;
	}

	/**
	 * Get title
	 *
	 * @return string
	 */
	public function getTitle()
	{
		return $this->title;
	}

	/**
	 * Set slug
	 *
	 * @param string $slug
	 *
	 * @return Page
	 */
	public function setSlug($slug)
	{
		$this->slug = $slug;

		return $this;
	}

	/**
	 * Get slug
	 *
	 * @return string
	 */
	public function getSlug()
	{
		return $this->slug;
	}

	/**
	 * @return bool
	 */
	public function isEnabled() {
		if($this->getPublishedAt() > new \DateTime() || ($this->getFinishedAt() && $this->getFinishedAt() <= new \DateTime())) {
			return false;
		}

		return $this->enabled;
	}

	/**
	 * @param bool $enabled
	 * @return Page
	 */
	public function setEnabled( bool $enabled ) {
		$this->enabled = $enabled;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isEditable() {
		return $this->editable;
	}

	/**
	 * @param bool $editable
	 * @return Page
	 */
	public function setEditable( bool $editable ) {
		$this->editable = $editable;

		return $this;
	}

	/**
	 * @return \DateTime
	 */
	public function getPublishedAt(): \DateTime {
		return $this->publishedAt;
	}

	/**
	 * @param \DateTime $publishedAt
	 * @return Page
	 */
	public function setPublishedAt( \DateTime $publishedAt ) {
		$this->publishedAt = $publishedAt;

		return $this;
	}

	/**
	 * @return \DateTime
	 */
	public function getCreatedAt(): \DateTime {
		return $this->createdAt;
	}

	/**
	 * @param \DateTime $createdAt
	 * @return Page
	 */
	public function setCreatedAt( \DateTime $createdAt ) {
		$this->createdAt = $createdAt;

		return $this;
	}

	/**
	 * @return \DateTime
	 */
	public function getFinishedAt() {
		return $this->finishedAt;
	}

	/**
	 * @param \DateTime $finishedAt
	 * @return Page
	 */
	public function setFinishedAt( $finishedAt ){
		$this->finishedAt = $finishedAt;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoTitle() {
		return $this->seoTitle;
	}

	/**
	 * @param string $seoTitle
	 * @return Page
	 */
	public function setSeoTitle($seoTitle ) {
		$this->seoTitle = $seoTitle;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoDescription() {
		return $this->seoDescription;
	}

	/**
	 * @param string $seoDescription
	 * @return Page
	 */
	public function setSeoDescription($seoDescription ) {
		$this->seoDescription = $seoDescription;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getOgTitle()
	{
		return $this->ogTitle;
	}

	/**
	 * @param string $ogTitle
	 * @return Page
	 */
	public function setOgTitle( $ogTitle )
	{
		$this->ogTitle = $ogTitle;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getOgDescription()
	{
		return $this->ogDescription;
	}

	/**
	 * @param string $ogDescription
	 * @return Page
	 */
	public function setOgDescription( $ogDescription )
	{
		$this->ogDescription = $ogDescription;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getOgImage()
	{
		return $this->ogImage;
	}

	/**
	 * @param string $ogImage
	 * @return Page
	 */
	public function setOgImage( $ogImage )
	{
		$this->ogImage = $ogImage;

		return $this;
	}

	/**
	 * @return ArrayCollection
	 */
	public function getBlocks() {
		return $this->blocks;
	}

	/**
	 * Add block.
	 *
	 * @param PageBlock $block
	 *
	 * @return Page
	 */
	public function addBlock(PageBlock $block)
	{
		if (!$this->blocks->contains($block)) {
			$block->setPage($this);
			$this->blocks->add($block);
		}

		return $this;
	}

	/**
	 * Remove block.
	 *
	 * @param PageBlock $block
	 *
	 * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
	 */
	public function removeBlock(PageBlock $block)
	{
		return $this->blocks->removeElement($block);
	}

	/**
	 * Set parent.
	 *
	 * @param Page $parent
	 *
	 * @return Page
	 */
	public function setParent(Page $parent)
	{
		$this->parent = $parent;

		return $this;
	}

	/**
	 * Get parent.
	 *
	 * @return Page
	 */
	public function getParent()
	{
		return $this->parent;
	}

	/**
	 * @return ArrayCollection
	 */
	public function getFields() {
		return $this->fields;
	}

	/**
	 * Add field.
	 *
	 * @param Field $field
	 *
	 * @return Page
	 */
	public function addField(Field $field)
	{
		if (!$this->fields->contains($field)) {
			$field->setPage($this);
			$this->fields->add($field);
		}

		return $this;
	}

	/**
	 * Remove field.
	 *
	 * @param Field $field
	 *
	 * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
	 */
	public function removeField(Field $field)
	{
		return $this->fields->removeElement($field);
	}

	/**
	 * @param $fields
	 * @return Page
	 */
	public function setFields($fields) {
		$this->fields = $fields;

		return $this;
	}

}
