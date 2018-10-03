<?php
/**
 * Created by Kévin Hilairet <kevin@octopouce.mu>
 * Date: 03/07/2018
 */

namespace Octopouce\CmsBundle\Form;

use Octopouce\CmsBundle\Entity\Field;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FieldType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
			$field = $event->getData();
			$form = $event->getForm();

			$form->add('value', TextareaType::class, [
				'label' => $field->getName()
			]);
		});
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults([
			'data_class' => Field::class
		]);
	}
}