<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Page
 *
 * @ORM\Table(name="cms_page")
 * @ORM\Entity()
 */
class Page
{
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
	 * @ORM\Column(name="slug", type="string", length=255, unique=true)
	 */
	protected $slug;

	/**
	 * @var bool
	 *
	 * @ORM\Column(name="enabled", type="boolean")
	 */
	protected $enabled;

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
	 * @ORM\Column(name="seo_facebook_title", type="string", length=255, nullable=true)
	 */
	protected $seoFacebookTitle;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_facebook_description", type="string", length=255, nullable=true)
	 */
	protected $seoFacebookDescription;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_facebook_image", type="string", length=255, nullable=true)
	 */
	protected $seoFacebookImage;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_twitter_title", type="string", length=255, nullable=true)
	 */
	protected $seoTwitterTitle;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_twitter_description", type="string", length=255, nullable=true)
	 */
	protected $seoTwitterDescription;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="seo_twitter_image", type="string", length=255, nullable=true)
	 */
	protected $seoTwitterImage;

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
	 */
	private $fields;

	/**
	 * Page constructor.
	 */
	public function __construct() {
		$this->enabled     = false;
		$this->publishedAt = new \DateTime('now');
		$this->createdAt   = new \DateTime('now');
		$this->fields      = new ArrayCollection();
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
	public function getSeoFacebookTitle() {
		return $this->seoFacebookTitle;
	}

	/**
	 * @param string $seoFacebookTitle
	 * @return Page
	 */
	public function setSeoFacebookTitle($seoFacebookTitle ) {
		$this->seoFacebookTitle = $seoFacebookTitle;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoFacebookDescription() {
		return $this->seoFacebookDescription;
	}

	/**
	 * @param string $seoFacebookDescription
	 * @return Page
	 */
	public function setSeoFacebookDescription($seoFacebookDescription ) {
		$this->seoFacebookDescription = $seoFacebookDescription;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoFacebookImage() {
		return $this->seoFacebookImage;
	}

	/**
	 * @param string $seoFacebookImage
	 * @return Page
	 */
	public function setSeoFacebookImage($seoFacebookImage ) {
		$this->seoFacebookImage = $seoFacebookImage;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoTwitterTitle() {
		return $this->seoTwitterTitle;
	}

	/**
	 * @param string $seoTwitterTitle
	 * @return Page
	 */
	public function setSeoTwitterTitle($seoTwitterTitle ) {
		$this->seoTwitterTitle = $seoTwitterTitle;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoTwitterDescription() {
		return $this->seoTwitterDescription;
	}

	/**
	 * @param string $seoTwitterDescription
	 * @return Page
	 */
	public function setSeoTwitterDescription($seoTwitterDescription ) {
		$this->seoTwitterDescription = $seoTwitterDescription;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSeoTwitterImage() {
		return $this->seoTwitterImage;
	}

	/**
	 * @param string $seoTwitterImage
	 * @return Page
	 */
	public function setSeoTwitterImage($seoTwitterImage ) {
		$this->seoTwitterImage = $seoTwitterImage;

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

}
