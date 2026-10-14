import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react'
import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { Student } from '@/features/students/types/students.types'
import { getStudentFullName } from '@/features/students/utils/students.utils'

import { PARENT_RELATIONSHIP_META, PARENT_STATUS_META } from '../constants/parents.constants'
import type { Parent, ParentSortKey } from '../types/parents.types'
import {
  formatParentPhone,
  getParentFullName,
  resolveParentChildren,
} from '../utils/parents.utils'
import { ParentAvatar } from './parent-avatar'
import { ParentRowActions } from './parent-row-actions'

interface ParentsTableProps {
  parents: Parent[]
  students: Student[]
  sort: ParentSortKey
  onSortChange: (sort: ParentSortKey) => void
  onEdit: (parent: Parent) => void
  onDelete: (parent: Parent) => void
}

function ParentCell({ parent }: { parent: Parent }) {
  return (
    <div className="flex items-center gap-3">
      <ParentAvatar parent={parent} />
      <div className="min-w-0 space-y-0.5">
        <Link
          to={`/parents/${parent.id}`}
          className="hover:text-primary hover:underline font-medium"
        >
          {getParentFullName(parent)}
        </Link>
        <p className="text-muted-foreground text-xs" dir="ltr">
          {formatParentPhone(parent.phone)}
        </p>
      </div>
    </div>
  )
}

function ChildrenCell({
  parent,
  students,
}: {
  parent: Parent
  students: Student[]
}) {
  const { t } = useI18n()
  const children = resolveParentChildren(parent.childrenIds, students)
  const visible = children.slice(0, 2)
  const rest = children.length - visible.length

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {t('parents.children.count', { count: children.length })}
        </Badge>
      </div>
      {visible.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {visible.map((student) => (
            <Link
              key={student.id}
              to={`/students/${student.id}`}
              className="hover:text-primary hover:underline text-muted-foreground text-xs"
            >
              {getStudentFullName(student)}
            </Link>
          ))}
          {rest > 0 ? (
            <span className="text-muted-foreground text-xs">
              {t('parents.children.more', { count: rest })}
            </span>
          ) : null}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      )}
    </div>
  )
}

/**
 * Desktop parent table. Hidden on narrow screens, where the card list is
 * shown instead (avoids horizontal scrolling).
 */
export function ParentsTable({
  parents,
  students,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: ParentsTableProps) {
  const { t, locale } = useI18n()

  const nameActive = sort === 'nameAsc' || sort === 'nameDesc'
  const nameDirection = sort === 'nameDesc' ? 'desc' : 'asc'
  const numberActive = sort === 'numberAsc' || sort === 'numberDesc'
  const numberDirection = sort === 'numberDesc' ? 'desc' : 'asc'
  const childrenActive = sort === 'childrenDesc' || sort === 'childrenAsc'
  const childrenDirection = sort === 'childrenDesc' ? 'desc' : 'asc'

  return (
    <div className="border-border bg-card hidden overflow-hidden rounded-lg border shadow-card md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    nameActive ? (nameDirection === 'asc' ? 'nameDesc' : 'nameAsc') : 'nameAsc',
                  )
                }
              >
                {t('parents.table.parent')}
                {nameActive ? (
                  nameDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    numberActive
                      ? numberDirection === 'asc'
                        ? 'numberDesc'
                        : 'numberAsc'
                      : 'numberAsc',
                  )
                }
              >
                {t('parents.table.parentNumber')}
                {numberActive ? (
                  numberDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('parents.table.relationship')}</TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  onSortChange(
                    childrenActive
                      ? childrenDirection === 'asc'
                        ? 'childrenDesc'
                        : 'childrenAsc'
                      : 'childrenDesc',
                  )
                }
              >
                {t('parents.table.children')}
                {childrenActive ? (
                  childrenDirection === 'asc' ? (
                    <ArrowUpIcon className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="size-3" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDownIcon className="text-muted-foreground size-3" aria-hidden="true" />
                )}
              </button>
            </TableHead>
            <TableHead>{t('parents.table.status')}</TableHead>
            <TableHead>{t('parents.table.createdDate')}</TableHead>
            <TableHead className="text-end">{t('parents.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parents.map((parent) => {
            const statusMeta = PARENT_STATUS_META[parent.status]
            const relationshipMeta = PARENT_RELATIONSHIP_META[parent.relationship]
            return (
              <TableRow key={parent.id}>
                <TableCell>
                  <ParentCell parent={parent} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className={cn('font-mono text-xs')}>{parent.parentNumber}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t(relationshipMeta.labelKey)}
                </TableCell>
                <TableCell>
                  <ChildrenCell parent={parent} students={students} />
                </TableCell>
                <TableCell>
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(parent.createdAt, locale)}
                </TableCell>
                <TableCell className="text-end">
                  <ParentRowActions parent={parent} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}