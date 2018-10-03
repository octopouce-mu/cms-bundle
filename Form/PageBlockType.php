<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Form;

use Octopouce\AdminBundle\Form\Type\SwitchType;
use Octopouce\CmsBundle\Entity\Block;
use Octopouce\CmsBundle\Entity\PageBlock;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageBlockType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{

		$builder
			->add('enabled', SwitchType::class, [
				'required' => false
			])
			->add('title', TextType::class)

			->add('block', EntityType::class, [
				'class' => Block::class,
				'choice_label' => 'name',
				'attr' => [
					'class' => 'select-block'
				]
			])

			->add('value', TextareaType::class, [
				'required' => false
			])

		;
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults([
			'data_class' => PageBlock::class
		]);
	}
}