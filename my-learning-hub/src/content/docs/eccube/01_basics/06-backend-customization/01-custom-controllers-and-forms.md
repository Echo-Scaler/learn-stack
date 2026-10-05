---
title: "01. Custom Controllers And Forms"
description: "EC-CUBE 4.x တွင် ဝန်ဆောင်မှုအသစ်များ (ဥပမာ: Custom Inquiry/Contact Form, Quotation Request, Custom Survey) တည်ဆောက်ရန်အတွက် Custom Controller, Symfony Form Type"
---

## Module 06 - အခန်း ၁: Custom Controllers, Forms နှင့် Validation

EC-CUBE 4.x တွင် ဝန်ဆောင်မှုအသစ်များ (ဥပမာ: Custom Inquiry/Contact Form, Quotation Request, Custom Survey) တည်ဆောက်ရန်အတွက် **Custom Controller, Symfony Form Type နှင့် Validation စည်းမျဉ်းများ** ရေးသားပုံကို အဆင့်ဆင့် လေ့လာပါမည်။

---

## ၁။ Custom Form Type ရေးသားခြင်း (Form Builder)

Symfony Form Component ကို အသုံးပြု၍ Form Field များနှင့် Validation Constraints များကို သီးသန့် Class အဖြစ် တည်ဆောက်ပါမည်။

`app/Customize/Form/Type/ContactFormType.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Customize\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ContactFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            // အမည် (Name)
            ->add('name', TextType::class, [
                'label' => 'အမည်',
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(['message' => 'အမည် ထည့်သွင်းရန် လိုအပ်ပါသည်']),
                    new Assert\Length(['max' => 50, 'maxMessage' => 'အမည်သည် စာလုံးရေ ၅၀ ထက် မကျော်ရပါ']),
                ],
                'attr' => ['placeholder' => 'ဥပမာ - မောင်မောင်'],
            ])
            // အီးမေးလ် (Email)
            ->add('email', EmailType::class, [
                'label' => 'အီးမေးလ်လိပ်စာ',
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(['message' => 'အီးမေးလ် ထည့်သွင်းရန် လိုအပ်ပါသည်']),
                    new Assert\Email(['message' => 'မှန်ကန်သော အီးမေးလ် ပုံစံ ဖြစ်ရပါမည်']),
                ],
                'attr' => ['placeholder' => 'example@mail.com'],
            ])
            // ဆက်သွယ်ရသည့် အကြောင်းအရာ (Inquiry Type)
            ->add('inquiry_type', ChoiceType::class, [
                'label' => 'မေးမြန်းလိုသည့် အကြောင်းအရာ',
                'required' => true,
                'choices' => [
                    'ကုန်ပစ္စည်းနှင့် ပတ်သက်၍' => 'product',
                    'အော်ဒါနှင့် ပို့ဆောင်ခနှင့် ပတ်သက်၍' => 'order',
                    'အခြား အထွေထွေ' => 'other',
                ],
                'placeholder' => '-- ရွေးချယ်ပါ --',
            ])
            // မက်ဆေ့ခ်ျ (Message Body)
            ->add('message', TextareaType::class, [
                'label' => 'မေးမြန်းလိုသော အသေးစိတ်',
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(['message' => 'အသေးစိတ် စာသား ရေးသားပေးပါ']),
                    new Assert\Length(['min' => 10, 'minMessage' => 'အနည်းဆုံး စာလုံးရေ ၁၀ လုံး ရှိရပါမည်']),
                ],
                'attr' => ['rows' => 6, 'placeholder' => 'မေးမြန်းလိုသည်များကို အသေးစိတ် ရေးသားပါ...'],
            ]);
    }
}
```

---

## ၂။ Custom Controller တွင် Form Handle ပြုလုပ်ခြင်း

`app/Customize/Controller/ContactCustomController.php` ကို ဖန်တီးပါ:

```php
<?php

namespace Customize\Controller;

use Customize\Form\Type\ContactFormType;
use Eccube\Controller\AbstractController;
use Eccube\Service\MailService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ContactCustomController extends AbstractController
{
    /**
     * @var MailService
     */
    private $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    /**
     * @Route("/contact-us", name="custom_contact", methods={"GET", "POST"})
     */
    public function index(Request $request): Response
    {
        // 1. Form Type ကို Instantiate ပြုလုပ်ပါ
        $form = $this->createForm(ContactFormType::class);
        $form->handleRequest($request);

        // 2. Form Submit လုပ်ထားပြီး Validation အားလုံး အောင်မြင်ပါက
        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            // Success Flash Message ပြသခြင်း
            $this->addFlash('eccube.front.success', 'ကျေးဇူးတင်ပါသည်။ သင်၏ မေးမြန်းချက်ကို အောင်မြင်စွာ လက်ခံရရှိပါပြီ။');

            // Form အောင်မြင်ပြီးနောက် ပြန်လည် Refresh မဖြစ်စေရန် Redirect လုပ်ပါ
            return $this->redirectToRoute('custom_contact_complete');
        }

        // 3. Form ကို Twig Template သို့ Render ပြုလုပ်ပါ
        return $this->render('Contact/custom_contact.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * ပြီးစီးကြောင်း စာမျက်နှာ
     * @Route("/contact-us/complete", name="custom_contact_complete", methods={"GET"})
     */
    public function complete(): Response
    {
        return $this->render('Contact/custom_contact_complete.twig');
    }
}
```

---

## ၃။ Twig Template ရေးသားခြင်း

`app/template/default/Contact/custom_contact.twig` ကို ဖန်တီးပါ:

```twig
{% extends '@default/default_frame.twig' %}

{% block main %}
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <h2 class="text-center mb-4 font-weight-bold">ဆက်သွယ်ရန် (Contact Us)</h2>

            {{ form_start(form, {'attr': {'novalidate': 'novalidate'}}) }}
                
                {{ form_errors(form) }}

                <div class="mb-3">
                    {{ form_label(form.name, null, {'label_attr': {'class': 'form-label'}}) }}
                    {{ form_widget(form.name, {'attr': {'class': 'form-control'}}) }}
                    <div class="text-danger small">{{ form_errors(form.name) }}</div>
                </div>

                <div class="mb-3">
                    {{ form_label(form.email, null, {'label_attr': {'class': 'form-label'}}) }}
                    {{ form_widget(form.email, {'attr': {'class': 'form-control'}}) }}
                    <div class="text-danger small">{{ form_errors(form.email) }}</div>
                </div>

                <div class="mb-3">
                    {{ form_label(form.inquiry_type, null, {'label_attr': {'class': 'form-label'}}) }}
                    {{ form_widget(form.inquiry_type, {'attr': {'class': 'form-select'}}) }}
                    <div class="text-danger small">{{ form_errors(form.inquiry_type) }}</div>
                </div>

                <div class="mb-3">
                    {{ form_label(form.message, null, {'label_attr': {'class': 'form-label'}}) }}
                    {{ form_widget(form.message, {'attr': {'class': 'form-control'}}) }}
                    <div class="text-danger small">{{ form_errors(form.message) }}</div>
                </div>

                <div class="text-center mt-4">
                    <button type="submit" class="btn btn-primary px-5 py-2">မေးမြန်းချက် ပေးပို့မည်</button>
                </div>

                {{ form_rest(form) }}
            {{ form_end(form) }}
        </div>
    </div>
</div>
{% endblock %}
```

---

နောက်အခန်းတွင် **[Module 06 - အခန်း ၂: Event Subscribers နှင့် Hook Points အသုံးပြုခြင်း](/eccube/01_basics/06-backend-customization/02-event-subscribers-hookpoints/)** ကို ဆက်လက်လေ့လာပါမည်။
