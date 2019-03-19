<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Form;

use Octopouce\AdminBundle\Form\Type\DatePickerType;
use Octopouce\AdminBundle\Form\Type\SwitchType;
use Octopouce\AdminBundle\Form\Type\TranslationsType;
use Octopouce\CmsBundle\Entity\Page;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;

class PageType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{

		$disabled = $options['editable'] || $options['superadmin'] ? false : true;

		$builder
			->add('title', TextType::class, [
				'disabled' => $disabled
			])



			->add('slug', TextType::class, [
				'attr' => ['placeholder' => ''],
				'disabled' => $disabled
			])


			->add('blocks', CollectionType::class, [
				'entry_type' => PageBlockType::class,
				'allow_add' => true,
				'allow_delete' => true,
				'label' => false,
				'by_reference' => false
			])

			->add('translations', TranslationsType::class, [
				'fields' => [
					'blocks' => [
						'field_type' => CollectionType::class,
						'entry_type' => PageBlockType::class,
						'label' => false
			        ]
 			    ],
				'excluded_fields' => ['fields', 'id', 'locale']
			])

//			->add('fields', CollectionType::class, [
//				'entry_type' => FieldType::class,
//				'label' => false,
//			])

			->add('enabled', SwitchType::class, [
				'required' => false,
				'disabled' => $disabled
			])
			->add('editable', SwitchType::class, [
				'required' => false,
				'disabled' => $options['superadmin'] ? false : true
			])
			->add('publishedAt', DatePickerType::class, [
				'disabled' => $disabled
			])
			->add('finishedAt', DatePickerType::class, [
				'required' => false,
				'disabled' => $disabled
			])

			->add('parent', EntityType::class, [
				'class' => Page::class,
				'choice_label' => 'title',
				'placeholder' => 'Choose parent page',
				'required' => false,
				'disabled' => $disabled
			])

			->add('seoTitle', TextType::class, [
				'required' => false
			])
			->add('seoDescription', TextType::class, [
				'required' => false,
				'constraints' => array(
					new Length(['max' => 300])
				)
			])

			->add('ogTitle', TextType::class, [
				'required' => false
			])
			->add('ogDescription', TextType::class, [
				'required' => false,
				'constraints' => array(
					new Length(['max' => 300])
				)
			])
			->add('ogImage', FileType::class, [
				'required' => false
			])


			->add('submit', SubmitType::class, [
				'label' => 'save'
			])
		;

//		$builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
//			$page = $event->getData();
//
//			$form = $event->getForm();
//			$form->add('fields', CollectionType::class);
//			foreach ($page->getFields() as $field) {
//				$form->get('fields')->add('field_'.$field->getName(), FieldType::class);
//			}
//
//		});
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults([
			'data_class' => Page::class,
			'superadmin' => false,
			'editable'   => true
		]);
	}
}
