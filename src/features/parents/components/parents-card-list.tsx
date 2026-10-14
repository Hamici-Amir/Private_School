import { Link } from 'react-router'

import { StatusBadge } from '@/components/data-display/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/hooks/use-i18n'
import { formatDate } from '@/lib/format'

import { PARENT_RELATIONSHIP_META, PARENT_STATUS_META } from '../constants/parents.constants'
import type { Parent } from '../types/parents.types'
import { formatParentPhone, getParentFullName } from '../utils/parents.utils'
import { ParentAvatar } from './parent-avatar'
import { ParentRowActions } from './parent-row-actions'

interface ParentsCardListProps {
  parents: Parent[]
  onEdit: (parent: Parent) => void
  onDelete: (parent: Parent) => void
}

/** Compact parent cards shown instead of the table on narrow screens. */
export function ParentsCardList({ parents, onEdit, onDelete }: ParentsCardListProps) {
  const { t, locale } = useI18n()

  return (
    <div className="space-y-3 md:hidden">
      {parents.map((parent) => {
        const statusMeta = PARENT_STATUS_META[parent.status]
        const relationshipMeta = PARENT_RELATIONSHIP_META[parent.relationship]
        return (
          <Card key={parent.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ParentAvatar parent={parent} size="md" />
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      to={`/parents/${parent.id}`}
                      className="hover:text-primary hover:underline font-medium"
                    >
                      {getParentFullName(parent)}
                    </Link>
                    <p className="text-muted-foreground text-xs">{t(relationshipMeta.labelKey)}</p>
                  </div>
                </div>
                <ParentRowActions parent={parent} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('parents.table.phone')}</dt>
                  <dd dir="ltr">{formatParentPhone(parent.phone)}</dd>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('parents.table.children')}</dt>
                  <dd>
                    <Badge variant="secondary">
                      {t('parents.children.count', { count: parent.childrenIds.length })}
                    </Badge>
                  </dd>
                </div>
                <div className="col-span-2">
                  <StatusBadge tone={statusMeta.tone}>{t(statusMeta.labelKey)}</StatusBadge>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <dt>{t('parents.table.createdDate')}</dt>
                  <dd>{formatDate(parent.createdAt, locale)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}