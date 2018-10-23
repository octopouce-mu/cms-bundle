<?php

namespace Octopouce\CmsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Page
 *
 * @ORM\Table(name="cms_block")
 * @ORM\Entity()
 */
class Block
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
	 * @ORM\Column(name="type", type="string", length=255, unique=true)
	 */
	protected $type;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="attributes", type="string", length=255, nullable=true)
	 */
	protected $attributes;

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
	 * @return Block
	 */
	public function setName( string $name ) {
		$this->name = $name;

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
	 * @return Block
	 */
	public function setType( string $type ) {
		$this->type = $type;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getAttributes() {
		return $this->attributes;
	}

	/**
	 * @param string $attributes
	 * @return Block
	 */
	public function setAttributes( $attributes ) {
		$this->attributes = $attributes;

		return $this;
	}



}
