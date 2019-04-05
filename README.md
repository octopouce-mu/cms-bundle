OctopouceCmsBundle
===================

Prerequisites
-------------

This version of the bundle requires Symfony Flex (>= 4.0) and PHP 7.
You want to use Doctrine ORM and MySQL.

Installation
------------

1. Download OctopouceCmsBundle using composer
2. Follow installation OctopouceAdminBundle
3. Update your database schema
4. Import OctopouceAdminBundle routing
5. Publish the Assets
6. Configure your file security
7. Usage : Add adzone in page

## Step 1: Download OctopouceCmsBundle using composer

Require the bundle with composer:

```bash
$ composer require octopouce-mu/cms-bundle
```

## Step 2: Follow installation OctopouceAdminBundle

For working the bundle, there needing OctopouceAdminBundle. Install dependencies bundles and configure.

[OctopouceAdminBundle](https://github.com/octopouce-mu/admin-bundle)


## Step 3: Update your database schema

For ORM run the following command.

```bash
$ php bin/console doctrine:schema:update --force
```

**Caution**

If error "1071 Specified key was too long; max key length is 767 bytes", you change configs doctrine :


```yaml
# config/packages/doctrine.yaml
doctrine:
    dbal:
        charset: utf8
        default_table_options:
            charset: utf8
            collate: utf8_unicode_ci
```

## Step 4: Import OctopouceCmsBundle routing files

Now that you have activated and configured the bundle, all that is left to do is
import the OctopouceCmsBundle routing files if Symfony Flex hasn't already imported the file.

```yaml
# config/routes/octopouce_cms.yaml
_octopouce_cms:
    resource: "@OctopouceCmsBundle/Resources/config/routing/routing.yaml"
```

## Step 5: Publish the Assets

```bash
$ php bin/console assets:install --symlink
```

## Step 6: Configure your file security

```yaml
# config/packages/security.yaml
security:
    role_hierarchy:
        ROLE_SHOW: ROLE_USER
        ROLE_CMS: ROLE_SHOW
        ROLE_ADMIN: [ROLE_CMS]
        ROLE_SUPER_ADMIN: ROLE_ADMIN
```

## Step 7: Generate Data Fixtures

The bundle need data default for working so uou can to generate fixtures data in database :

```bash
$ php bin/console doctrine:fixtures:load
```

Others bundles
--------------

You can to add bundles with OctopouceAdminBundle :

- [OctopouceBlogBundle](https://github.com/octopouce-mu/blog-bundle)
- [OctopouceAdvertisingBundle](https://github.com/octopouce-mu/advertising-bundle)
