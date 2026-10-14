import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
import { useI18n } from '@/hooks/use-i18n'

import {
  STUDENT_GENDERS,
  STUDENT_GENDER_META,
  STUDENT_LEVELS,
  STUDENT_STATUSES,
  STUDENT_STATUS_META,
  getClassesForLevel,
  levelLabelKey,
} from '../constants/students.constants'
import { createStudentSchema } from '../schemas/students.validation'
import type { EducationLevel, Student, StudentFormValues } from '../types/students.types'
import { getEmptyFormValues, toFormValues } from '../utils/students.utils'

interface StudentFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/undefined → create mode; otherwise edit mode. */
  student: Student | null
  busy: boolean
  onSubmit: (values: StudentFormValues) => void
}

/** Add/edit student form rendered in a side sheet. */
export function StudentFormSheet({
  open,
  onOpenChange,
  student,
  busy,
  onSubmit,
}: StudentFormSheetProps) {
  const { t } = useI18n()

  const schema = useMemo(
    () =>
      createStudentSchema({
        required: t('students.form.validation.required'),
        emailInvalid: t('students.form.validation.emailInvalid'),
        phoneInvalid: t('students.form.validation.phoneInvalid'),
        birthDateFuture: t('students.form.validation.birthDateFuture'),
        firstNameTooLong: t('students.form.validation.firstNameTooLong'),
        lastNameTooLong: t('students.form.validation.lastNameTooLong'),
        guardianNameTooLong: t('students.form.validation.guardianNameTooLong'),
        addressTooLong: t('students.form.validation.addressTooLong'),
      }),
    [t],
  )
  const resolver = useMemo(() => zodResolver(schema), [schema])

  const form = useForm<StudentFormValues>({
    resolver,
    defaultValues: student ? toFormValues(student) : getEmptyFormValues(),
  })

  const { control, reset, setValue, handleSubmit } = form
  const selectedLevel = useWatch({ control, name: 'level' })

  useEffect(() => {
    if (open) {
      reset(student ? toFormValues(student) : getEmptyFormValues(), {
        keepDefaultValues: false,
      })
    }
  }, [open, student, reset])

  function handleLevelChange(level: EducationLevel) {
    const firstClass = getClassesForLevel(level)[0]
    setValue('classId', firstClass?.id ?? '', { shouldValidate: true })
  }

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
                {student ? t('students.form.titleEdit') : t('students.form.titleCreate')}
              </SheetTitle>
              <SheetDescription>
                {student
                  ? t('students.form.descriptionEdit')
                  : t('students.form.descriptionCreate')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 px-4 py-4">
              <Section>
                <SectionTitle>{t('students.form.sections.identity')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('students.form.placeholders.firstName')}
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
                        <FormLabel required>{t('students.form.fields.lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('students.form.placeholders.lastName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.birthDate')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel required>{t('students.form.fields.gender')}</FormLabel>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          {STUDENT_GENDERS.map((gender) => (
                            <div key={gender} className="flex items-center gap-2">
                              <RadioGroupItem value={gender} id={`gender-${gender}`} />
                              <Label htmlFor={`gender-${gender}`}>
                                {t(STUDENT_GENDER_META[gender].labelKey)}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>{t('students.form.sections.contact')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('students.form.fields.email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('students.form.placeholders.email')}
                            {...field}
                          />
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
                        <FormLabel>{t('students.form.fields.address')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('students.form.placeholders.address')}
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
                <SectionTitle>{t('students.form.sections.guardian')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.guardianName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('students.form.placeholders.guardianName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="guardianPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.guardianPhone')}</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="tel"
                            dir="ltr"
                            placeholder={t('students.form.placeholders.guardianPhone')}
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
                <SectionTitle>{t('students.form.sections.academics')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.level')}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            handleLevelChange(value as EducationLevel)
                            field.onChange(value)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STUDENT_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level} — {t(levelLabelKey(level))}
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
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.classId')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getClassesForLevel(selectedLevel).map((studentClass) => (
                              <SelectItem key={studentClass.id} value={studentClass.id}>
                                {studentClass.label}
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
                    name="enrollmentDate"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel required>{t('students.form.fields.enrollmentDate')}</FormLabel>
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
                <SectionTitle>{t('students.form.sections.status')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('students.form.fields.status')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STUDENT_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(STUDENT_STATUS_META[status].labelKey)}
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
                {t('students.form.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}