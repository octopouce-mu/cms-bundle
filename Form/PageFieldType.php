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
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageFieldType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder

			->add('fields', CollectionType::class, [
				'entry_type' => FieldType::class,
				'label' => false,
				'allow_add' => true,
				'allow_delete' => true
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