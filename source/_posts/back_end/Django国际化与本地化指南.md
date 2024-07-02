---
title: Django国际化与本地化指南
date: 2024/5/12 16:51:04
updated: 2024/5/12 16:51:04
categories:
  - 后端开发

tags:
  - Django-i18n
  - 本地化-L10n
  - 多语言
  - 国际化
  - 翻译工具
  - 表单验证
  - 性能优化
---

<img src="https://static.cmdragon.cn/blog/images/2024_05_12 16_54_10.png@blog" title="2024_05_12 16_54_10.png" alt="2024_05_12 16_54_10.png"/>

## 引言

在数字化时代，网站和应用程序必须跨越地域限制，服务于全球用户。这就是国际化（Internationalization, I18N）和本地化（Localization,
L10N）的重要性日益凸显。它们不仅关乎用户体验，也影响着企业的全球市场竞争力。一个成功的国际化应用不仅能让用户感受到尊重，还能提高用户的满意度和忠诚度。

Django，作为一款强大的Web开发框架，因其灵活性和强大的功能，已经成为构建多语言网站的理想选择。Django内置了完整的国际化和本地化支持，使得开发者能够轻松地为不同语言环境提供定制化的用户体验，无需从头开始构建复杂的解决方案。

## 第1章 Django简介

### 1.1 Django框架概述

Django是一个高级的Python
Web框架，它鼓励快速开发和干净、实用的设计。由经验丰富的开发者构建，它解决了Web开发中的许多麻烦，因此你可以专注于编写你的应用，而不需要重新发明轮子。Django遵循MTV（模型-模板-视图）设计模式，这有助于将应用程序的不同方面分离开来，使得代码更加模块化和易于维护。

Django的核心组件包括：

- **模型（Model）** ：定义数据结构，通常与数据库交互。
- **模板（Template）** ：定义用户界面的外观，使用Django模板语言。
- **视图（View）** ：处理业务逻辑，从模型中获取数据，并将其传递给模板。

此外，Django还提供了许多其他功能，如表单处理、用户认证、会话管理、缓存系统、管理界面等，这些都是开箱即用的。

### 1.2 国际化与本地化在Web开发中的作用

国际化和本地化是Web开发中不可或缺的部分，尤其是在构建面向全球用户的应用时。

- **国际化（I18N）** ：指的是设计应用程序，使其能够适应不同的语言和地区，而不需要进行工程上的更改。这通常涉及确保应用程序的代码库可以处理多种语言字符集，以及提供一种机制来存储和检索不同语言的文本。
- **本地化（L10N）** ：是在国际化的基础上，为特定的语言或地区定制应用程序的过程。这包括翻译文本、调整日期和时间格式、货币格式等，以符合当地的习惯和标准。

在Web开发中，国际化和本地化的作用主要体现在以下几个方面：

- **用户体验**：提供用户母语的内容可以显著提高用户体验，使用户感到更加舒适和受欢迎。
- **市场扩展**：通过支持多种语言，企业可以更容易地进入新市场，吸引更广泛的客户群。
- **法规遵从**：在某些国家和地区，提供本地化内容是法律或政策的要求。
- **竞争优势**：在竞争激烈的市场中，提供多语言支持可以成为企业的差异化优势。

Django框架通过其内置的国际化和本地化工具，为开发者提供了强大的支持，使得构建多语言网站变得更加简单和高效。在接下来的章节中，我们将深入探讨如何在Django项目中实现国际化和本地化。

## 第2章 国际化与本地化基础

### 2.1 什么是国际化与本地化

- **国际化（Internationalization，I18N）**
  ：是指设计和开发软件应用程序，使其能够轻松地适应不同的语言和地区，而无需对程序进行重大修改。国际化的目标是使应用程序能够灵活地支持多种语言和文化习惯，以便全球用户能够方便地使用该应用。
- **本地化（Localization，L10N）**
  ：是在国际化的基础上，根据特定的语言、地区或文化对应用程序进行定制，以提供更符合当地习惯和习俗的用户体验。本地化包括翻译文本、调整日期、时间、货币格式等，使应用程序更贴近当地用户的需求。

### 2.2 Django中的国际化与本地化支持

Django提供了强大的国际化和本地化支持，使开发者能够轻松地构建多语言和多地区的Web应用。在Django中，国际化和本地化主要涉及以下几个方面：

- **多语言支持**：Django允许开发者轻松地将应用程序翻译成多种语言，通过使用Django提供的翻译工具和国际化支持，可以实现应用程序的多语言化。
- **日期时间格式化**：Django提供了内置的日期时间格式化功能，开发者可以根据用户的本地设置格式化日期和时间，以确保日期时间显示符合用户的习惯。
- **货币格式化**：Django还提供了货币格式化功能，开发者可以根据用户的本地设置格式化货币金额，以便在不同地区显示适当的货币符号和格式。

### 2.3 设置默认语言和时区

在Django项目中，可以通过设置默认语言和时区来实现国际化和本地化。在项目的settings.py文件中，可以进行如下设置：

- **设置默认语言**：可以通过LANGUAGE_CODE选项来设置项目的默认语言。例如，将默认语言设置为英语：

```python
LANGUAGE_CODE = 'en-us'
```

- **设置默认时区**：可以通过TIME_ZONE选项来设置项目的默认时区。例如，将默认时区设置为东八区：

```python
TIME_ZONE = 'Asia/Shanghai'
```

通过设置默认语言和时区，可以确保应用程序在启动时使用指定的语言和时区，为用户提供更好的体验。同时，Django还提供了更灵活的方式来处理用户的语言和时区偏好，以确保用户能够根据自己的需求进行设置。

## 第3章 Django多语言支持

### 3.1 配置多语言支持

在Django中启用多语言支持，首先需要在项目的settings.py文件中进行配置。以下是一些关键的设置：

- **设置可用语言**：使用LANGUAGES设置来定义你的应用程序支持的语言列表。例如：

```python
LANGUAGES = [
    ('en', _('English')),
    ('es', _('Spanish')),
    # 添加更多语言...
]
```

- **启用国际化中间件**：确保MIDDLEWARE设置中包含'django.middleware.locale.LocaleMiddleware'，这是处理语言选择的中间件。

```python
MIDDLEWARE = [
    # ...
    'django.middleware.locale.LocaleMiddleware',
    # ...
]
```

- **设置默认语言**：通过LANGUAGE_CODE设置默认语言，如'en-us'代表美国英语。

```python
LANGUAGE_CODE = 'en-us'
```

### 3.2 翻译模板与静态文本

Django使用gettext来处理翻译。在模板和Python代码中，你可以使用特殊的模板标签和函数来标记需要翻译的文本。

- **在模板中翻译文本**：使用`{% trans %}`标签标记静态文本，使用`{% blocktrans %}`标签标记动态文本。例如：

```html
<p>{% trans "Welcome to our website" %}</p>
<p>{% blocktrans %}You have {{ num_messages }} message{{ num_messages|pluralize }}.{% endblocktrans %}</p>
```

- **在Python代码中翻译文本**：使用`gettext`或其简写`_`函数来标记需要翻译的文本。例如：

```python
from django.utils.translation import gettext as _


def my_view(request):
    output = _("Welcome to our website")
    return HttpResponse(output)
```

### 3.3 提供多语言内容

为了提供多语言内容，你需要创建翻译文件，并确保它们被正确加载。

- **创建翻译文件**：使用Django的makemessages命令来创建翻译文件。例如，为所有支持的语言创建翻译文件：

```bash
django-admin makemessages -l de
django-admin makemessages -l es
```

- **编辑翻译文件**：翻译文件是PO文件，你可以使用文本编辑器或专门的翻译工具来编辑它们。
- **编译翻译文件**：使用compilemessages命令来编译翻译文件，生成可被Django使用的MO文件。

```bash
django-admin compilemessages
```

- **在模板中选择语言**：使用`{% language %}`和`{% endlanguage %}`标签来指定模板中特定部分的语言。

```html
{% language 'es' %}
<p>Bienvenido a nuestro sitio web</p>
{% endlanguage %}
```

- **在视图中切换语言**：在视图中，你可以使用`django.utils.translation.activate()`函数来动态切换用户的语言偏好。

```python
from django.utils.translation import activate


def set_language(request, language_code):
    activate(language_code)
    # 重定向到之前的页面或其他页面
    return redirect('home')
```

通过上述步骤，你可以为你的Django应用程序配置多语言支持，并提供翻译后的内容给不同语言的用户。

## 第4章 翻译与本地化

### 4.1 使用Django提供的翻译工具

Django提供了一些管理翻译的命令和工具，让你可以轻松地管理和维护翻译文件。

- **makemessages命令**：使用makemessages命令来扫描代码中的标记文本，并生成PO文件。例如：

```bash
django-admin makemessages -l de
```

- **compilemessages命令**：使用compilemessages命令来编译PO文件，生成可供Django使用的MO文件。例如：

```bash
django-admin compilemessages
```

- **翻译管理界面**：Django提供了一个内置的翻译管理界面，让你可以在网页上编辑和管理翻译文件。

```python
# 在urls.py中添加以下代码
from django.conf.urls import url
from django.utils.translation import gettext_lazy as _

urlpatterns = [
    url(_(r'^i18n/'), include('django.conf.urls.i18n')),
]
```

### 4.2 自定义翻译文件

除了使用Django提供的工具外，你也可以自定义翻译文件来实现更灵活的翻译需求。

- **创建自定义翻译文件**：你可以手动创建PO文件，并在其中添加需要翻译的文本和对应的翻译。例如：

```python
msgid
"Hello, world!"
msgstr
"你好，世界！"
```

- **加载自定义翻译文件**：在settings.py中使用LOCALE_PATHS设置来指定额外的翻译文件路径。例如：

```python
LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale_custom'),
]
```

### 4.3 动态内容的本地化处理

AD：[漫画首页](https://comic.amd794.com:2087/)

对于动态内容的本地化处理，你可以使用Django提供的一些工具和技术来实现。

- **日期时间本地化**
  ：使用Django的内置过滤器和函数来本地化日期时间。例如，在模板中使用`{{ value|date:"SHORT_DATE_FORMAT" }}`来显示本地化的日期。
- **货币本地化**：使用Django的内置过滤器和函数来本地化货币。例如，在模板中使用`{{ value|currency }}`来显示本地化的货币格式。
- **数字本地化**：使用Django的内置过滤器和函数来本地化数字。例如，在模板中使用`{{ value|floatformat }}`来显示本地化的数字格式。

通过以上方法，你可以利用Django提供的翻译工具和本地化处理技术，轻松实现动态内容的本地化，为用户提供更好的多语言体验。

## 第5章 日期、时间和数字格式化

### 5.1 日期时间格式化

Django提供了多种方式来格式化日期时间，包括模板标签、过滤器和Python代码中的函数。

- **模板标签**：在模板中使用`{% now "SHORT_DATETIME_FORMAT" %}`来显示当前日期时间。
- **过滤器**：在模板中使用`{{ value|date:"SHORT_DATETIME_FORMAT" }}`来显示指定日期时间值的格式化结果。
- **Python函数**：在Python代码中使用`from django.utils import format_date`来格式化日期时间。例如：

```python
from django.utils import format_date

value = '2022-01-01 12:00:00'
result = format_date(value, 'SHORT_DATETIME_FORMAT')
```

### 5.2 数字格式化

Django也提供了多种方式来格式化数字，包括模板标签、过滤器和Python代码中的函数。

- **模板标签**：在模板中使用`{% load humanize %}`来加载humanize模板标签，然后使用`{{ value|floatformat:2 }}`
  来显示指定精度的浮点数格式化结果。
- **过滤器**：在模板中使用`{{ value|intcomma }}`来显示带逗号分隔的整数格式化结果。
- **Python函数**：在Python代码中使用`from django.utils.html import format_html`来格式化数字。例如：

```python
from django.utils.html import format_html

value = 1000000
result = format_html('{:,}'.format(value))
```

### 5.3 本地化日期、时间和数字显示

Django支持本地化日期、时间和数字显示，可以在模板中使用`{% load l10n %}`来加载本地化标签，然后使用`{% localize on %}`
来启用本地化。例如：

```html
{% load l10n %}

<p>{% localize on %}{{ value }}{% endlocalize %}</p>
```

这样Django会根据当前语言环境来格式化日期、时间和数字。同时，你也可以使用`USE_L10N`设置来控制是否启用本地化。例如：

```python
USE_L10N = True
```

通过以上方法，你可以轻松实现日期时间和数字的格式化和本地化，为用户提供更好的界面体验。

## 第6章 语言选择与切换

### 6.1 根据用户偏好选择语言

Django可以自动检测用户的浏览器语言环境，并根据该信息来选择合适的语言进行显示。可以在`settings.py`中设置`LANGUAGE_CODE`
和`LANGUAGE_COOKIE_NAME`来实现此功能。例如：

```python
LANGUAGE_CODE = 'zh-hans'
LANGUAGE_COOKIE_NAME = 'django_language'
```

### 6.2 手动切换语言

Django还提供了手动切换语言的功能，可以在模板中使用`{% language "zh-hans" %}`来设置当前语言环境。例如：

```html

<form action="{% url 'set_language' %}" method="post">
    {% csrf_token %}
    <input name="next" type="hidden" value="{{ redirect_to }}">
    <select name="language">
        {% get_language_info_list for LANGUAGES as languages %}
        {% for language in languages %}
        <option value="{{ language.code }}" {% if language.code== LANGUAGE_CODE %} selected{% endif %}>
            {{ language.name_local }} ({{ language.code }})
        </option>
        {% endfor %}
    </select>
    <input type="submit" value="确定">
</form>
```

### 6.3 语言选择器的实现

可以在模板中实现语言选择器，例如：

```html

<form action="{% url 'set_language' %}" method="post">
    {% csrf_token %}
    <input name="next" type="hidden" value="{{ redirect_to }}">
    <select name="language">
        {% get_language_info_list for LANGUAGES as languages %}
        {% for language in languages %}
        <option value="{{ language.code }}" {% if language.code== LANGUAGE_CODE %} selected{% endif %}>
            {{ language.name_local }} ({{ language.code }})
        </option>
        {% endfor %}
    </select>
    <input type="submit" value="确定">
</form>
```

这样就可以在页面中显示语言选择器，用户可以根据自己的需要来选择语言环境。同时，可以通过在`views.py`中定义`set_language`
视图函数来处理语言选择器的提交请求，例如：

```python
from django.shortcuts import redirect
from django.utils.translation import activate


def set_language(request):
    response = redirect(request.GET.get('next', '/'))
    if request.method == 'POST':
        language = request.POST.get('language')
        if language:
            activate(language)
            request.session[LANGUAGE_COOKIE_NAME] = language
    return response
```

这样，当用户提交语言选择器的请求时，就会调用`set_language`视图函数，并根据用户选择的语言环境来进行切换。

## 第7章 多语言表单与验证

### 7.1 多语言表单字段处理

在Django中，可以使用`ModelForm`或者`Form`来创建多语言表单。首先需要在`models.py`中定义多语言字段，例如：

```python
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    description_en = models.TextField()
    description_fr = models.TextField()
```

然后在`forms.py`中创建表单类，使用`ModelForm`或者`Form`，并在表单字段中指定多语言字段，例如：

```python
from django import forms
from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description_en', 'description_fr']
```

### 7.2 多语言表单验证

Django提供了强大的表单验证功能，可以在表单类中定义`clean_<field_name>()`方法来对特定字段进行验证。可以根据需要在不同语言字段上进行验证，例如：

```python
from django import forms
from django.core.exceptions import ValidationError
from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description_en', 'description_fr']

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if len(name) < 3:
            raise ValidationError('Name must be at least 3 characters long.')
        return name
```

### 7.3 多语言表单错误信息处理

可以在模板中使用`{{ form.errors }}`
来显示表单验证错误信息。如果需要对不同语言字段的错误信息进行定制，可以在表单类中重写`error_messages`属性，例如：

```python
from django import forms
from django.core.exceptions import ValidationError
from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description_en', 'description_fr']

    error_messages = {
        'name': {
            'required': 'Name is required.',
            'invalid': 'Please enter a valid name.',
        },
        'description_en': {
            'required': 'English description is required.',
        },
        'description_fr': {
            'required': 'French description is required.',
        },
    }
```

这样就可以根据不同语言字段的需求来定制错误信息。在模板中使用`{{ form.errors.field_name }}`
来显示特定字段的错误信息，例如`{{ form.errors.name }}`、`{{ form.errors.description_en }}`、`{{ form.errors.description_fr }}`。

## 第8章 国际化与本地化最佳实践

### 8.1 优化多语言网站性能

AD：[专业搜索引擎](https://movie.amd794.com:2083/)

优化多语言网站性能的关键在于减少加载时间和提高响应速度。以下是一些最佳实践：

- **使用内容分发网络（CDN）** ：通过在全球多个地点部署服务器，CDN可以加速静态资源的加载，如图片、CSS和JavaScript文件。
- **压缩资源**：压缩HTML、CSS和JavaScript文件，减少文件大小，加快下载速度。
- **懒加载**：对于图片和视频等资源，使用懒加载技术，即只在用户滚动到它们时才加载。
- **缓存策略**：合理设置HTTP缓存头，让浏览器缓存静态资源，减少重复请求。
- **代码分割**：对于大型应用，使用代码分割技术，按需加载页面或组件，减少初始加载时间。
- **优化数据库查询**：确保数据库查询高效，使用索引和缓存来减少数据库负载。

### 8.2 处理特殊语言环境下的挑战

在处理特殊语言环境时，可能会遇到一些挑战，如：

- **字符编码**：确保网站支持所有目标语言的字符编码，如UTF-8。
- **文本方向**：某些语言（如阿拉伯语和希伯来语）是从右向左书写的，网站设计需要支持这种文本方向。
- **字体支持**：确保使用的字体支持所有目标语言的字符。
- **日期和时间格式**：不同地区有不同的日期和时间格式，需要根据用户的地理位置来显示。
- **货币和度量单位**：根据用户所在地区显示相应的货币和度量单位。

### 8.3 多语言SEO优化

为了提高多语言网站在搜索引擎中的排名，需要进行SEO优化：

- **使用hreflang标签**：在网页的头部添加hreflang标签，告诉搜索引擎该页面的不同语言版本，帮助搜索引擎正确地索引和展示页面。
- **本地化内容**：确保每个语言版本的内容都是本地化的，不仅仅是翻译，还要考虑文化差异和用户习惯。
- **URL结构**：使用清晰的多语言URL结构，如使用子目录（/en/、/fr/）或子域名（en.example.com、fr.example.com）。
- **关键词研究**：针对每种语言进行关键词研究，确保内容针对正确的关键词进行优化。
- **本地化元数据**：为每种语言版本的页面提供本地化的标题标签、描述标签和关键词标签。
- **社交媒体和本地化链接建设**：在目标语言的社交媒体上推广内容，并建立本地化的链接。

通过遵循这些最佳实践，可以有效地优化多语言网站的性能，处理特殊语言环境下的挑战，并提高多语言SEO的效果。

## 第9章 多语言站点部署与管理

### 9.1 部署多语言站点

部署多语言站点需要考虑以下几个方面：

- **选择合适的技术栈**：选择适合多语言站点的技术栈，如使用国际化框架或多语言CMS系统。
- **建立多语言URL结构**：设计清晰的URL结构，以便用户和搜索引擎能够轻松找到不同语言版本的页面。
- **配置服务器**：根据目标受众地区选择合适的服务器位置，确保快速访问速度。
- **本地化资源**：准备多语言版本的静态资源、图片和其他文件，确保它们在站点部署中被正确加载。

### 9.2 管理多语言内容

管理多语言内容是确保站点内容准确、一致和时效的关键。以下是一些管理多语言内容的最佳实践：

- **使用翻译工具**：可以使用翻译工具或服务来快速翻译内容，但需要人工审核和修改以确保准确性。
- **建立翻译流程**：建立清晰的翻译流程，包括审核和校对环节，确保翻译质量。
- **统一术语和风格**：建立统一的术语表和风格指南，确保不同语言版本的内容风格和用词一致。
- **定期更新内容**：定期审查和更新多语言内容，确保信息的准确性和时效性。

### 9.3 多语言站点的维护与更新

维护和更新多语言站点是持续改进和优化站点的重要部分。以下是一些建议：

- **监控站点性能**：定期监控站点性能，包括加载速度、响应时间和可用性，及时解决问题。
- **更新内容**：定期更新站点内容，包括新闻、产品信息和博客文章，保持用户关注度。
- **优化SEO**：持续优化多语言站点的SEO，包括关键词研究、内容优化和链接建设。
- **备份和安全**：定期备份站点数据，确保数据安全，防止意外丢失。

通过有效的多语言站点部署与管理，可以确保站点内容的多样性和丰富性，提升用户体验，吸引更多国际受众，并提升站点在搜索引擎中的排名。

## 第10章 未来展望与扩展

### 10.1 国际化与本地化技术发展趋势

AD：[首页 | 一个覆盖广泛主题工具的高效在线平台](https://amd794.com/)

随着全球化的加速，国际化（i18n）与本地化（l10n）技术也在不断发展。以下是一些未来可能的发展趋势：

- **自动化翻译**：随着人工智能和机器学习技术的发展，自动化翻译的准确性和流畅性将不断提高，减少对人工翻译的依赖。
- **实时本地化**：实时本地化技术将允许内容创作者即时更新和发布多语言内容，提高内容的时效性和相关性。
- **多模态交互**：随着语音识别和自然语言处理技术的发展，多语言站点将支持更多模态的交互，如语音输入和输出。
- **个性化体验**：通过分析用户数据，站点可以提供更加个性化的多语言体验，包括定制化的内容推荐和界面布局。

### 10.2 Django新版本对国际化与本地化的改进

Django作为一个流行的Python Web框架，不断更新其国际化和本地化功能。未来的Django版本可能会带来以下改进：

- **更高效的翻译管理**：Django可能会引入更高效的翻译管理工具，简化翻译流程，提高翻译效率。
- **更好的前端集成**：Django可能会改进与前端框架的集成，使得前端国际化更加无缝和高效。
- **增强的本地化支持**：Django可能会增加对更多语言和区域设置的支持，包括非拉丁字符集和复杂脚本。
- **更智能的翻译提示**：Django可能会利用机器学习技术提供更智能的翻译提示和建议，帮助开发者更快地完成翻译工作。

### 10.3 与前端框架整合的国际化解决方案

随着前端技术的快速发展，与前端框架整合的国际化解决方案也变得越来越重要。以下是一些可能的整合方案：

- **统一的国际化API**：开发一个统一的国际化API，使得前端框架可以轻松地与后端国际化系统集成。
- **前端翻译管理工具**：开发专门的前端翻译管理工具，允许开发者直接在前端界面上管理和更新翻译内容。
- **动态语言切换**：实现动态语言切换功能，允许用户在浏览过程中即时切换语言，无需刷新页面。
- **本地化资源缓存**：优化本地化资源的加载和缓存策略，提高多语言站点的性能和用户体验。

## 结语

在全球化的时代，国际化与本地化技术不仅对于企业和组织而言，也对于个人开发者而言都是至关重要的。通过国际化和本地化，我们可以更好地满足用户对多语言和多文化内容的需求，提高用户体验和参与度。

在本文中，我们介绍了国际化与本地化技术的基本概念和实现方法，并分享了一些关于未来发展趋势和解决方案的思考。希望这些信息能够帮助您更好地理解和应用国际化与本地化技术。

资源推荐与进一步学习

如果您想深入了解国际化与本地化技术，以下是一些推荐的资源和工具：

- Django国际化和本地化文档：<https://docs.djangoproject.com/en/4.1/topics/i18n/>
- Unicode官方网站：<https://www.unicode.org/>
- 国际化和本地化标准ISO 639和ISO 3166：<https://www.iso.org/iso-639-language-codes.html>
- 自动化翻译工具：<https://www.deepl.com/>
- 前端国际化库：<https://formatjs.io/>
- 国际化和本地化社区和论坛：<https://www.i18nguru.com/>

祝您在国际化与本地化的探索中取得成功！

## 附录

### Django国际化与本地化相关API参考

1. `gettext`函数：

    ```python
    from django.utils.translation import gettext
    translated_text = gettext('Hello, world!')
    ```

2. `gettext_lazy`函数：

    ```python
    from django.utils.translation import gettext_lazy
    translated_text_lazy = gettext_lazy('Hello, world!')
    ```

3. `ugettext`函数：

    ```python
    from django.utils.translation import ugettext
    translated_text = ugettext('Hello, world!')
    ```

4. `ugettext_lazy`函数：

    ```python
    from django.utils.translation import ugettext_lazy
    translated_text_lazy = ugettext_lazy('Hello, world!')
    ```

5. `LANGUAGE_CODE`设置：

    ```python
    LANGUAGE_CODE = 'en-us'
    ```

6. `LOCALE_PATHS`设置：

    ```python
    LOCALE_PATHS = [
        '/path/to/locale/directory',
    ]
    ```

7. `activate`函数：

    ```python
    from django.utils.translation import activate
    activate('fr')
    ```

8. `deactivate`函数：

    ```python
    from django.utils.translation import deactivate
    deactivate()
    ```

### 常见问题解答

1. 什么是Django的国际化（i18n）和本地化（l10n）？

    - 国际化是指将应用程序设计成可以轻松支持多种语言和文化的能力，而本地化是指根据用户的语言和文化习惯来适配应用程序的过程。

2. 如何在Django中启用国际化和本地化？

    - 首先，在`settings.py`中设置`USE_I18N = True`和`USE_L10N = True`，然后使用Django提供的国际化和本地化API来标记和翻译文本。

3. 如何在Django模板中使用国际化？

    - 在模板中使用`{% load i18n %}`加载国际化模板标签，然后使用`{% trans %}`或`{% blocktrans %}`标签来翻译文本。

4. 如何在Django视图中使用国际化？

    - 在视图中使用Django提供的`gettext`或`ugettext`函数来翻译文本，确保在使用前加载翻译模块。

5. 如何在Django管理后台中实现多语言支持？

    - 可以通过在`ModelAdmin`类中设置`list_display`等属性使用`gettext`或`ugettext`函数来实现多语言支持。

希望以上信息对您有所帮助！