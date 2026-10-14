import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/feedback/spinner'
import { useI18n } from '@/hooks/use-i18n'
import { useSystemInfo } from '@/features/dashboard/hooks/use-system-info'

/** Interactive showcase of the technical foundation (primitives + state). */
export function FoundationPage() {
  const { t } = useI18n()
  const systemInfo = useSystemInfo()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('foundationPage.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('foundationPage.description')}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{t('foundationPage.buttons')}</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Icon button">
            ➕
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{t('foundationPage.cards')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('foundationPage.loading')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Spinner label={t('common.loading')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('foundationPage.form')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="font-demo-label">Label</Label>
                <Input id="font-demo-label" placeholder="Input" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{t('foundationPage.system')}</h2>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            {systemInfo.isPending ? (
              <Spinner label={t('common.loading')} />
            ) : (
              <>
                <Badge variant={systemInfo.data?.source === 'mock' ? 'secondary' : 'success'}>
                  {systemInfo.data?.source === 'mock'
                    ? t('foundationPage.mockSource')
                    : t('foundationPage.apiSource')}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {systemInfo.data?.data.name} · v{systemInfo.data?.data.version}
                </span>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
