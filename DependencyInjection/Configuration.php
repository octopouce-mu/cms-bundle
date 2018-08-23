<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 30/05/2018
 */

namespace Octopouce\CmsBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface {

	public function getConfigTreeBuilder()
	{
		$treeBuilder = new TreeBuilder();
		$rootNode = $treeBuilder->root('octopouce_cms');

		$rootNode
			->children()
				->booleanNode('enabled')->defaultTrue()->end()
				->scalarNode('upload_path')->defaultValue('uploads/cms')->end()
			->end()
		;

		return $treeBuilder;
	}
}