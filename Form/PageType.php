<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Form;

use Octopouce\AdminBundle\Form\Type\DatePickerType;
use Octopouce\AdminBundle\Form\Type\SwitchType;
use Octopouce\CmsBundle\Entity\Page;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{

		$builder
			->add('title', TextType::class)
			->add('slug', TextType::class, [
				'attr' => ['placeholder' => '']
			])


			->add('blocks', CollectionType::class, [
				'entry_type' => PageBlockType::class,
				'allow_add' => true,
				'allow_delete' => true,
				'label' => false,
				'by_reference' => false
			])


			->add('enabled', SwitchType::class, [
				'required' => false
			])
			->add('publishedAt', DatePickerType::class)
			->add('finishedAt', DatePickerType::class, [
				'required' => false
			])

			->add('parent', EntityType::class, [
				'class' => Page::class,
				'choice_label' => 'title',
				'placeholder' => 'Choose parent page',
				'required' => false
			])

			->add('seoTitle', TextType::class, [
				'required' => false
			])
			->add('seoDescription', TextType::class, [
				'required' => false
			])

			->add('seoFacebookTitle', TextType::class, [
				'required' => false
			])
			->add('seoFacebookDescription', TextType::class, [
				'required' => false
			])
			->add('seoFacebookImage', FileType::class, [
				'required' => false
			])

			->add('seoTwitterTitle', TextType::class, [
				'required' => false
			])
			->add('seoTwitterDescription', TextType::class, [
				'required' => false
			])
			->add('seoTwitterImage', FileType::class, [
				'required' => false
			])


			->add('submit', SubmitType::class, [
				'label' => 'save'
			])
		;
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults([
			'data_class' => Page::class
		]);
	}
}