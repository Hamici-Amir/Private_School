import { useEffect, useMemo, useState } from 'react'
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
import { levelLabelKey, STUDENT_LEVELS } from '@/features/students/constants/students.constants'
import { getTeachers } from '@/features/teachers/services/teachers.service'
import { getTeacherFullName } from '@/features/teachers/utils/teachers.utils'
import type { Teacher } from '@/features/teachers/types/teachers.types'
import { useI18n } from '@/hooks/use-i18n'

import { CLASS_STATUSES, CLASS_STATUS_META } from '../constants/classes.constants'
import { createClassSchema } from '../schemas/classes.validation'
import type { ClassFormValues, SchoolClass } from '../types/classes.types'
import { getEmptyFormValues, toFormValues } from '../utils/classes.utils'

interface ClassFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `null`/undefined → create mode; otherwise edit mode. */
  schoolClass: SchoolClass | null
  busy: boolean
  onSubmit: (values: ClassFormValues) => void
}

/** Add/edit class form rendered in a side sheet. */
export function ClassFormSheet({
  open,
  onOpenChange,
  schoolClass,
  busy,
  onSubmit,
}: ClassFormSheetProps) {
  const { t } = useI18n()

  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    let active = true
    getTeachers()
      .then((data) => {
        if (active) setTeachers(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const schema = useMemo(
    () =>
      createClassSchema({
        required: t('classes.form.validation.required'),
        labelTooLong: t('classes.form.validation.labelTooLong'),
        roomTooLong: t('classes.form.validation.roomTooLong'),
        capacityInvalid: t('classes.form.validation.capacityInvalid'),
        capacityInt: t('classes.form.validation.capacityInt'),
      }),
    [t],
  )
  const resolver = useMemo(() => zodResolver(schema), [schema])

  const form = useForm<ClassFormValues>({
    resolver,
    defaultValues: schoolClass ? toFormValues(schoolClass) : getEmptyFormValues(),
  })

  const { control, reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset(schoolClass ? toFormValues(schoolClass) : getEmptyFormValues(), {
        keepDefaultValues: false,
      })
    }
  }, [open, schoolClass, reset])

  const levelOptions = STUDENT_LEVELS.map((level) => ({
    value: level,
    label: `${level} — ${t(levelLabelKey(level))}`,
  }))

  const headTeacherOptions = [
    { value: 'none', label: t('classes.form.headTeacherNone') },
    ...teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.teacherNumber} — ${getTeacherFullName(teacher)}`,
    })),
  ]

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
                {schoolClass ? t('classes.form.titleEdit') : t('classes.form.titleCreate')}
              </SheetTitle>
              <SheetDescription>
                {schoolClass
                  ? t('classes.form.descriptionEdit')
                  : t('classes.form.descriptionCreate')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 px-4 py-4">
              <Section>
                <SectionTitle>{t('classes.form.sections.identity')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('classes.form.fields.label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('classes.form.placeholders.label')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('classes.form.fields.level')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                <SectionTitle>{t('classes.form.sections.organization')}</SectionTitle>
                <SectionContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('classes.form.fields.room')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('classes.form.placeholders.room')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('classes.form.fields.capacity')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            inputMode="numeric"
                            {...field}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value === '' ? 0 : Number(event.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="headTeacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('classes.form.fields.headTeacher')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {headTeacherOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('classes.form.fields.status')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CLASS_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(CLASS_STATUS_META[status].labelKey)}
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
                {t('classes.form.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
