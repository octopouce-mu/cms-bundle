<?php

namespace Octopouce\CmsBundle\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Octopouce\CmsBundle\Entity\Block;

class BlockFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {
	    $this->loadBlock($manager);
    }

    private function loadBlock(ObjectManager $manager)
    {
        foreach ($this->getData() as [$name, $type, $attributes]) {
        	if(!$manager->getRepository(Block::class)->findOneByName($name)) {
		        $block = new Block();
		        $block->setName($name);
		        $block->setType($type);
		        $block->setAttributes($attributes);

		        $manager->persist($block);
	        }
        }

        $manager->flush();
    }

    private function getData(): array
    {
        return [
            // $userData = [name, type, attributes];
	        ['Text', 'textarea', null],
	        ['Wysiwyg', 'wysiwyg', null],
	        ['Tabs', 'tabs', null],
	        ['Sliders', 'sliders', null],
        ];
    }
}
