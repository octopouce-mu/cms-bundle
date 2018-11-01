<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Page
 *
 * @ORM\Table(name="cms_field")
 * @ORM\Entity()
 */
class Field
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
	 * @ORM\Column(name="name", type="string", length=255)
	 */
	protected $name;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="slug", type="string", length=255)
	 */
	protected $slug;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="type", type="string", length=255)
	 */
	protected $type;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="value", type="text", nullable=true)
	 */
	protected $value;

	/**
	 * @var int
	 *
	 * @ORM\Column(name="sort", type="integer", nullable=true))
	 */
	protected $sort;

	/**
	 * @var Page
	 *
	 * @ORM\ManyToOne(targetEntity="Octopouce\CmsBundle\Entity\Page", inversedBy="fields")
	 * @ORM\JoinColumn(nullable=false)
	 */
	private $page;


	/**
	 * @return int
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @param string $name
	 * @return Field
	 */
	public function setName( $name ) {
		$this->name = $name;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSlug() {
		return $this->slug;
	}

	/**
	 * @param string $slug
	 * @return Field
	 */
	public function setSlug( $slug ) {
		$this->slug = $slug;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getType() {
		return $this->type;
	}

	/**
	 * @param string $type
	 * @return Field
	 */
	public function setType( $type ) {
		$this->type = $type;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getValue() {
		return $this->value;
	}

	/**
	 * @param string $value
	 * @return Field
	 */
	public function setValue( $value ) {
		$this->value = $value;

		return $this;
	}

	/**
	 * @return integer
	 */
	public function getSort() {
		return $this->sort;
	}

	/**
	 * @param integer $sort
	 * @return Field
	 */
	public function setSort( $sort ) {
		$this->sort = $sort;

		return $this;
	}

	/**
	 * Set page.
	 *
	 * @param Page $page
	 *
	 * @return Field
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
}
