import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/forms/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Section, SectionContent, SectionTitle } from '@/components/layout/section'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/hooks/use-i18n'

import {
  PARENT_GENDERS,
  PARENT_GENDER_META,
  PARENT_RELATIONSHIPS,
  PARENT_RELATIONSHIP_META,
  PARENT_STATUSES,
  PARENT_STATUS_META,
} from '../constants/parents.constants'
import { createParentSchema } from '../schemas/parents.validation'
import type { Parent, ParentFormValues } from '../types/parents.types'
import { getEmptyFormValues, toFormValues } from '../utils/parents.utils'

interface ParentFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/undefined → create mode; otherwise edit mode. */
  parent: Parent | null
  busy: boolean
  onSubmit: (values: ParentFormValues) => void
}

/** Add/edit parent form rendered in a side sheet. */
export function ParentFormSheet({
  open,
  onOpenChange,
  parent,
  busy,
  onSubmit,
}: ParentFormSheetProps) {
  const { t } = useI18n()

  const schema = useMemo(
    () =>
      createParentSchema({
        required: t('parents.form.validation.required'),
        emailInvalid: t('parents.form.validation.emailInvalid'),
        phoneInvalid: t('parents.form.validation.phoneInvalid'),
        contactRequired: t('parents.form.validation.contactRequired'),
        firstNameTooLong: t('parents.form.validation.firstNameTooLong'),
        lastNameTooLong: t('parents.form.validation.lastNameTooLong'),
        addressTooLong: t('parents.form.validation.addressTooLong'),
        cityTooLong: t('parents.form.validation.cityTooLong'),
        occupationTooLong: t('parents.form.validation.occupationTooLong'),
        nationalityTooLong: t('parents.form.validation.nationalityTooLong'),
        notesTooLong: t('parents.form.validation.notesTooLong'),
      }),
    [t],
  )
  const resolver = useMemo(() => zodResolver(schema), [schema])

  const form = useForm<ParentFormValues>({
    resolver,
    defaultValues: parent ? toFormValues(parent) : getEmptyFormValues(),
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset(parent ? toFormValues(parent) : getEmptyFormValues(), {
        keepDefaultValues: false,
      })
    }
  }, [open, parent, reset])

  return (
    <Sheet open={open} onOpenChange={(value) => onOpenChange(value && !busy)}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
        <Form {...form}>
          <form
            noValidate
            className="flex h-full flex-col overflow-y-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <SheetHeader>
              <SheetTitle>
                {parent ? t('parents.form.titleEdit') : t('parents.form.titleCreate')}
              </SheetTitle>
              <SheetDescription>
                {parent
                  ? t('parents.form.descriptionEdit')
                  : t('parents.form.descriptionCreate')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 px-4 py-4">
              <Section>
                <SectionTitle>{t('parents.form.sections.personal')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('parents.form.placeholders.firstName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.lastName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('parents.form.placeholders.lastName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="firstNameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.firstNameAr')}</FormLabel>
                        <FormControl>
                          <Input
                            dir="rtl"
                            placeholder={t('parents.form.placeholders.firstNameAr')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastNameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.lastNameAr')}</FormLabel>
                        <FormControl>
                          <Input
                            dir="rtl"
                            placeholder={t('parents.form.placeholders.lastNameAr')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.gender')}</FormLabel>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          {PARENT_GENDERS.map((gender) => (
                            <div key={gender} className="flex items-center gap-2">
                              <RadioGroupItem value={gender} id={`parent-gender-${gender}`} />
                              <Label htmlFor={`parent-gender-${gender}`}>
                                {t(PARENT_GENDER_META[gender].labelKey)}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.relationship')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PARENT_RELATIONSHIPS.map((relationship) => (
                              <SelectItem key={relationship} value={relationship}>
                                {t(PARENT_RELATIONSHIP_META[relationship].labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('parents.form.sections.contact')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.phone')}</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="tel"
                            dir="ltr"
                            placeholder={t('parents.form.placeholders.phone')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="secondaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.secondaryPhone')}</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="tel"
                            dir="ltr"
                            placeholder={t('parents.form.placeholders.secondaryPhone')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('parents.form.placeholders.email')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.city')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('parents.form.placeholders.city')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>{t('parents.form.fields.address')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('parents.form.placeholders.address')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('parents.form.sections.professional')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.occupation')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('parents.form.placeholders.occupation')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.nationality')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('parents.form.placeholders.nationality')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('parents.form.sections.additional')}</SectionTitle>
                <SectionContent className="grid gap-4">
                  <FormField
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('parents.form.fields.notes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('parents.form.placeholders.notes')}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('parents.form.fields.status')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PARENT_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(PARENT_STATUS_META[status].labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>
            </div>

            <SheetFooter className="border-border border-t">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={busy}>
                {t('parents.form.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}