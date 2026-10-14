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
  TEACHER_GENDERS,
  TEACHER_GENDER_META,
  TEACHER_QUALIFICATIONS,
  TEACHER_QUALIFICATION_META,
  TEACHER_SPECIALTIES,
  TEACHER_SPECIALTY_META,
  TEACHER_STATUSES,
  TEACHER_STATUS_META,
} from '../constants/teachers.constants'
import { createTeacherSchema } from '../schemas/teachers.validation'
import type { Teacher, TeacherFormValues } from '../types/teachers.types'
import { getEmptyFormValues, toFormValues } from '../utils/teachers.utils'

interface TeacherFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/undefined → create mode; otherwise edit mode. */
  teacher: Teacher | null
  busy: boolean
  onSubmit: (values: TeacherFormValues) => void
}

/** Add/edit teacher form rendered in a side sheet. */
export function TeacherFormSheet({
  open,
  onOpenChange,
  teacher,
  busy,
  onSubmit,
}: TeacherFormSheetProps) {
  const { t } = useI18n()

  const schema = useMemo(
    () =>
      createTeacherSchema({
        required: t('teachers.form.validation.required'),
        emailInvalid: t('teachers.form.validation.emailInvalid'),
        phoneInvalid: t('teachers.form.validation.phoneInvalid'),
        contactRequired: t('teachers.form.validation.contactRequired'),
        birthDateFuture: t('teachers.form.validation.birthDateFuture'),
        hireDateFuture: t('teachers.form.validation.hireDateFuture'),
        firstNameTooLong: t('teachers.form.validation.firstNameTooLong'),
        lastNameTooLong: t('teachers.form.validation.lastNameTooLong'),
        addressTooLong: t('teachers.form.validation.addressTooLong'),
        cityTooLong: t('teachers.form.validation.cityTooLong'),
        notesTooLong: t('teachers.form.validation.notesTooLong'),
      }),
    [t],
  )
  const resolver = useMemo(() => zodResolver(schema), [schema])

  const form = useForm<TeacherFormValues>({
    resolver,
    defaultValues: teacher ? toFormValues(teacher) : getEmptyFormValues(),
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset(teacher ? toFormValues(teacher) : getEmptyFormValues(), {
        keepDefaultValues: false,
      })
    }
  }, [open, teacher, reset])

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
                {teacher ? t('teachers.form.titleEdit') : t('teachers.form.titleCreate')}
              </SheetTitle>
              <SheetDescription>
                {teacher
                  ? t('teachers.form.descriptionEdit')
                  : t('teachers.form.descriptionCreate')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 px-4 py-4">
              <Section>
                <SectionTitle>{t('teachers.form.sections.identity')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('teachers.form.placeholders.firstName')}
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
                        <FormLabel required>{t('teachers.form.fields.lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('teachers.form.placeholders.lastName')}
                            {...field}
                          />
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
                        <FormLabel>{t('teachers.form.fields.firstNameAr')}</FormLabel>
                        <FormControl>
                          <Input
                            dir="rtl"
                            placeholder={t('teachers.form.placeholders.firstNameAr')}
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
                        <FormLabel>{t('teachers.form.fields.lastNameAr')}</FormLabel>
                        <FormControl>
                          <Input
                            dir="rtl"
                            placeholder={t('teachers.form.placeholders.lastNameAr')}
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
                        <FormLabel required>{t('teachers.form.fields.gender')}</FormLabel>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          {TEACHER_GENDERS.map((gender) => (
                            <div key={gender} className="flex items-center gap-2">
                              <RadioGroupItem value={gender} id={`teacher-gender-${gender}`} />
                              <Label htmlFor={`teacher-gender-${gender}`}>
                                {t(TEACHER_GENDER_META[gender].labelKey)}
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
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.birthDate')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('teachers.form.sections.contact')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.phone')}</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="tel"
                            dir="ltr"
                            placeholder={t('teachers.form.placeholders.phone')}
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
                        <FormLabel>{t('teachers.form.fields.email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('teachers.form.placeholders.email')}
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
                        <FormLabel>{t('teachers.form.fields.city')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('teachers.form.placeholders.city')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teachers.form.fields.address')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('teachers.form.placeholders.address')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('teachers.form.sections.professional')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.specialty')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEACHER_SPECIALTIES.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {t(TEACHER_SPECIALTY_META[specialty].labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.qualification')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEACHER_QUALIFICATIONS.map((qualification) => (
                              <SelectItem key={qualification} value={qualification}>
                                {t(TEACHER_QUALIFICATION_META[qualification].labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('teachers.form.fields.hireDate')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel required>{t('teachers.form.fields.status')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEACHER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(TEACHER_STATUS_META[status].labelKey)}
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
                <SectionTitle>{t('teachers.form.sections.additional')}</SectionTitle>
                <SectionContent className="grid gap-4">
                  <FormField
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teachers.form.fields.notes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teachers.form.placeholders.notes')}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
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
                {t('teachers.form.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}