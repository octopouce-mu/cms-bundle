<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Page
 *
 * @ORM\Table(name="cms_page_block")
 * @ORM\Entity()
 */
class PageBlock
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
	 * @var bool
	 *
	 * @ORM\Column(name="enabled", type="boolean")
	 */
	protected $enabled;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="value", type="text", nullable=true)
	 */
	protected $value;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="attributes", type="string", length=255, nullable=true)
	 */
	protected $attributes;

	/**
	 * @var Page
	 *
	 * @ORM\ManyToOne(targetEntity="Octopouce\CmsBundle\Entity\Page", inversedBy="blocks")
	 * @ORM\JoinColumn(nullable=false)
	 */
	private $page;

	/**
	 * @var Block
	 *
	 * @ORM\ManyToOne(targetEntity="Octopouce\CmsBundle\Entity\Block")
	 * @ORM\JoinColumn(nullable=false)
	 */
	private $block;


	/**
	 * Page constructor.
	 */
	public function __construct() {
		$this->enabled = true;
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
	 * @return PageBlock
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
	 * @return bool
	 */
	public function isEnabled() {

		return $this->enabled;
	}

	/**
	 * @param bool $enabled
	 * @return PageBlock
	 */
	public function setEnabled( bool $enabled ) {
		$this->enabled = $enabled;

		return $this;
	}

	/**
	 * Set value
	 *
	 * @param string $value
	 *
	 * @return PageBlock
	 */
	public function setValue($value)
	{
		$this->value = $value;

		return $this;
	}

	/**
	 * Get value
	 *
	 * @return string
	 */
	public function getValue()
	{
		return $this->value;
	}

	/**
	 * @return string
	 */
	public function getAttributes() {
		return $this->attributes;
	}

	/**
	 * @param string $attributes
	 * @return PageBlock
	 */
	public function setAttributes( string $attributes ) {
		$this->attributes = $attributes;

		return $this;
	}

	/**
	 * Set page.
	 *
	 * @param Page $page
	 *
	 * @return PageBlock
	 */
	public function setPage(Page $page)
	{
		$this->page = $page;

		return $this;
	}

	/**
	 * Get page.
	 *
	 * @return Page
	 */
	public function getPage()
	{
		return $this->page;
	}

	/**
	 * Set block.
	 *
	 * @param Block $block
	 *
	 * @return PageBlock
	 */
	public function setBlock(Block $block)
	{
		$this->block = $block;

		return $this;
	}

	/**
	 * Get block.
	 *
	 * @return Block
	 */
	public function getBlock()
	{
		return $this->block;
	}
}
