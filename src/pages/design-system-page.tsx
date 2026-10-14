import { useState } from 'react'
import {
  AlertTriangleIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleUserIcon,
  DownloadIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'
import { legacyCreateColumnHelper } from '@tanstack/react-table/legacy'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  PageActions,
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/layout'
import { AvatarGroup } from '@/components/data-display/avatar-group'
import { StatusBadge, type StatusTone } from '@/components/data-display/status-badge'
import { StatCard } from '@/components/data-display/stat-card'
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
} from '@/components/data-display/data-table'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import {
  CardSkeleton,
  FormSkeleton,
  ListSkeleton,
  TableSkeleton,
} from '@/components/feedback/loading-skeletons'
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'
import { FormDialog, InfoDialog, LoadingDialog } from '@/components/dialogs/form-dialog'
import { toast } from '@/lib/toast'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

interface DemoSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border p-4 sm:p-6">
      <div className="space-y-1">
        <h2 className="text-h3">{title}</h2>
        {description ? <p className="text-muted-foreground text-body-sm">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

function PaletteRow({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('size-10 shrink-0 rounded-md border shadow-sm', className)} />
      <p className="text-body-sm font-medium">{name}</p>
    </div>
  )
}

interface DemoStudent {
  id: string
  name: string
  className: string
  status: DemoStatus
}

type DemoStatus = 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid'

const DEMO_STUDENTS: DemoStudent[] = [
  { id: 'S-001', name: 'Amine Benali', className: '3e année A', status: 'active' },
  { id: 'S-002', name: 'Yasmine Saadi', className: '2e année B', status: 'paid' },
  { id: 'S-003', name: 'Mohamed Idir', className: '1re année A', status: 'pending' },
  { id: 'S-004', name: 'Lina Bouzid', className: '4e année A', status: 'inactive' },
  { id: 'S-005', name: 'Rania Cherif', className: '3e année B', status: 'unpaid' },
  { id: 'S-006', name: 'Yacine Khelifi', className: '2e année A', status: 'active' },
  { id: 'S-007', name: 'Maya Toumi', className: '5e année A', status: 'paid' },
  { id: 'S-008', name: 'Adam Zerrouki', className: '1re année B', status: 'active' },
]

const STATUS_TONE: Record<DemoStatus, StatusTone> = {
  active: 'success',
  paid: 'success',
  pending: 'warning',
  inactive: 'neutral',
  unpaid: 'error',
}

const columnHelper = legacyCreateColumnHelper<DemoStudent>()

const studentColumns: DataTableColumn<DemoStudent>[] = [
  columnHelper.display({
    id: 'id',
    header: 'ID',
    cell: (info) => <span className="font-mono text-caption">{info.row.original.id}</span>,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor('className', {
    id: 'className',
    header: ({ column }) => <DataTableColumnHeader column={column} label="Class" />,
    enableSorting: true,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue<DemoStatus>()
      return (
        <StatusBadge tone={STATUS_TONE[status]}>{String(status).replaceAll('-', ' ')}</StatusBadge>
      )
    },
  }),
]

/** Interactive reference page for the Design System (development only). */
export function DesignSystemPage() {
  const { t } = useI18n()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [loadingOpen, setLoadingOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const showLoadingDemo = () => {
    setLoadingOpen(true)
    window.setTimeout(() => setLoadingOpen(false), 1600)
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="space-y-1">
          <PageTitle>{t('designSystem.title')}</PageTitle>
          <PageDescription>{t('designSystem.description')}</PageDescription>
        </div>
        <PageActions>
          <Button variant="outline" onClick={() => toast.info('RTL-aware toast (demo)')}>
            Show toast
          </Button>
        </PageActions>
      </PageHeader>

      <DemoSection
        title="Colors"
        description="Semantic tokens — switch the site theme to preview dark mode."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <PaletteRow name="Background" className="bg-background" />
          <PaletteRow name="Foreground" className="bg-foreground" />
          <PaletteRow name="Card" className="bg-card" />
          <PaletteRow name="Primary" className="bg-primary" />
          <PaletteRow name="Secondary" className="bg-secondary" />
          <PaletteRow name="Muted" className="bg-muted" />
          <PaletteRow name="Accent" className="bg-accent" />
          <PaletteRow name="Border" className="bg-border" />
          <PaletteRow name="Success" className="bg-success" />
          <PaletteRow name="Warning" className="bg-warning" />
          <PaletteRow name="Destructive" className="bg-destructive" />
          <PaletteRow name="Info" className="bg-info" />
        </div>
      </DemoSection>

      <DemoSection title="Typography" description="Semantic type scale (display → caption).">
        <div className="space-y-3">
          <p className="text-display">Display — قواعد النجاح / Règles de réussite</p>
          <p className="text-h1">H1 — School Management</p>
          <p className="text-h2">H2 — Section title</p>
          <p className="text-h3">H3 — Card title</p>
          <p className="text-h4">H4 — Group label</p>
          <p className="text-body-lg">Body Large — regular reading text.</p>
          <p className="text-body">Body — the default paragraph size.</p>
          <p className="text-body-sm">Body Small — secondary paragraphs.</p>
          <p className="text-caption text-muted-foreground">Caption — timestamps, meta.</p>
          <p className="text-label">Label — form labels &amp; small titles.</p>
          <p className="text-button">Button — button text.</p>
        </div>
      </DemoSection>

      <DemoSection title="Buttons" description="Variants and sizes, including loading state.">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <PlusIcon aria-hidden="true" />
          </Button>
          <Button loading aria-label="Submitting">
            Loading
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </DemoSection>

      <DemoSection title="Inputs & form controls">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="demo-input">Input</Label>
            <Input id="demo-input" placeholder="Placeholder" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-invalid" className="text-destructive">
              Invalid
            </Label>
            <Input id="demo-invalid" aria-invalid defaultValue="Invalid value" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-textarea">Textarea</Label>
            <Textarea id="demo-textarea" placeholder="Write a note…" />
          </div>
          <div className="space-y-2">
            <Label>Select</Label>
            <Select defaultValue="fr">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-check">Checkbox</Label>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox id="demo-check" />
              <Label htmlFor="demo-check">Opt in to notifications</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Switch</Label>
            <div className="pt-1">
              <Switch defaultChecked aria-label="Enable feature" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Radio group</Label>
            <RadioGroup defaultValue="a" className="pt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="ra" />
                <Label htmlFor="ra">Option A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="rb" />
                <Label htmlFor="rb">Option B</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Slider</Label>
            <div className="pt-3">
              <Slider defaultValue={[45]} max={100} step={1} aria-label="Volume" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date (react-day-picker)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  {date ? date.toLocaleDateString() : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Badges & statuses"
        description="Semantic badges plus the module-agnostic StatusBadge."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success-soft">Success soft</Badge>
          <Badge variant="warning-soft">Warning soft</Badge>
          <Badge variant="info-soft">Info soft</Badge>
          <Badge variant="destructive-soft">Destructive soft</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="success">Active</StatusBadge>
          <StatusBadge tone="warning">Pending</StatusBadge>
          <StatusBadge tone="error">Unpaid</StatusBadge>
          <StatusBadge tone="info">Excused</StatusBadge>
          <StatusBadge tone="neutral">Inactive</StatusBadge>
        </div>
      </DemoSection>

      <DemoSection title="Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Standard card</CardTitle>
              <CardDescription>Description of the card contents.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-body-sm">
              Body copy for the content area of the card.
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
          <StatCard
            title="Students"
            value="1 284"
            description="this month"
            trend={{ value: '+3.2%', positive: true }}
            icon={BookOpenIcon}
          />
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src="" alt="" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <CardTitle className="text-base">Amine Benali</CardTitle>
                <CardDescription>3e année A</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <AvatarGroup
                size="sm"
                items={[
                  { name: 'Amine Benali' },
                  { name: 'Yasmine Saadi' },
                  { name: 'Mohamed Idir' },
                  { name: 'Lina Bouzid' },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </DemoSection>

      <DemoSection title="Alerts">
        <div className="space-y-3">
          <Alert>
            <InfoIcon aria-hidden="true" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>A neutral informational message.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CheckCircle2Icon aria-hidden="true" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>The operation completed successfully.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTriangleIcon aria-hidden="true" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Some action requires your attention.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangleIcon aria-hidden="true" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong. Please try again.</AlertDescription>
          </Alert>
        </div>
      </DemoSection>

      <DemoSection
        title="DataTable"
        description="Sorting, search, selection, pagination and column visibility."
      >
        <DataTable
          columns={studentColumns}
          data={DEMO_STUDENTS}
          getRowId={(row) => row.id}
          searchableColumns={['name', 'className', 'id']}
          pageSize={5}
          initialSort={[{ id: 'name', desc: false }]}
          bulkActions={(_selected) => (
            <Button size="sm" variant="destructive">
              <Trash2Icon className="size-4" aria-hidden="true" /> Bulk action
            </Button>
          )}
        />
      </DemoSection>

      <DemoSection title="Dialogs & confirmations">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Basic dialog</DialogTitle>
                <DialogDescription>
                  Content goes here. Escape or the close button dismisses it.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2Icon aria-hidden="true" /> Delete (confirm)
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete student record"
            description="This action cannot be undone. The student record will be permanently removed."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            variant="destructive"
            onConfirm={() => {
              setConfirmOpen(false)
              toast.success('Record deleted (demo)')
            }}
          />

          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon aria-hidden="true" /> New (form dialog)
          </Button>
          <FormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            title="Create student"
            description="Fill this form during the demo."
            submitLabel="Create"
            onSubmit={() => {
              setFormOpen(false)
              toast.success('Student created (demo)')
            }}
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="demo-name">Full name</Label>
                <Input id="demo-name" placeholder="Amine Benali" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-class">Class</Label>
                <Input id="demo-class" placeholder="3e année A" />
              </div>
            </div>
          </FormDialog>

          <Button variant="outline" onClick={() => setInfoOpen(true)}>
            <InfoIcon aria-hidden="true" /> Info
          </Button>
          <InfoDialog
            open={infoOpen}
            onOpenChange={setInfoOpen}
            title="Enrollment closed"
            description="Enrollment for the current year ended on 15 August."
            icon={<BookOpenIcon className="size-5" aria-hidden="true" />}
          />

          <Button variant="secondary" onClick={showLoadingDemo}>
            Loading dialog
          </Button>
          <LoadingDialog open={loadingOpen} label="Exporting records…" />
        </div>
      </DemoSection>

      <DemoSection title="Tabs, accordion & dropdown">
        <div className="space-y-4">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-muted-foreground text-body-sm">
              Overview tab content.
            </TabsContent>
            <TabsContent value="details" className="text-muted-foreground text-body-sm">
              Details tab content.
            </TabsContent>
            <TabsContent value="activity" className="text-muted-foreground text-body-sm">
              Activity tab content.
            </TabsContent>
          </Tabs>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How does billing work?</AccordionTrigger>
              <AccordionContent>Billing is handled per student, per payment plan.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can I export reports?</AccordionTrigger>
              <AccordionContent>Yes — from the Reports module later.</AccordionContent>
            </AccordionItem>
          </Accordion>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SettingsIcon aria-hidden="true" /> Actions{' '}
                <ChevronDownIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Student</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.info('Edit (demo)')}>
                <PlusIcon className="size-4" aria-hidden="true" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.info('Export (demo)')}>
                <DownloadIcon className="size-4" aria-hidden="true" /> Export
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => toast.error('Delete (demo)')}>
                <Trash2Icon className="size-4" aria-hidden="true" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DemoSection>

      <DemoSection title="Tooltips, toggles & command">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Upload">
                  <UploadIcon aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload files</TooltipContent>
            </Tooltip>
            <Toggle aria-label="Bold">B</Toggle>
            <Toggle variant="outline" aria-label="Italic">
              I
            </Toggle>
          </div>

          <Command className="rounded-lg border shadow-sm max-w-md">
            <CommandInput placeholder="Type to search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => toast.info('Navigating (demo)')}>
                  <SearchIcon aria-hidden="true" />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => toast.info('Navigating (demo)')}>
                  <CircleUserIcon aria-hidden="true" />
                  <span>Students</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DemoSection>

      <DemoSection title="Avatars & progress">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar size="xs">
            <AvatarImage src="" alt="" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarImage src="" alt="" />
            <AvatarFallback>YS</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage src="" alt="" />
            <AvatarFallback>MI</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="" alt="" />
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarImage src="" alt="" />
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-56 space-y-2">
          <Progress value={72} aria-label="Progress" />
          <Skeleton className="h-2 w-full" />
        </div>
      </DemoSection>

      <DemoSection title="Loading states">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <CardSkeleton />
            <FormSkeleton fields={2} />
          </div>
          <ListSkeleton items={4} />
          <TableSkeleton rows={4} columns={3} className="bg-card rounded-lg border p-3" />
        </div>
      </DemoSection>

      <DemoSection title="Empty & error states">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={SearchIcon}
                title="No students found"
                description="Try adjusting your filters or create a new record."
                action={
                  <Button size="sm">
                    <PlusIcon aria-hidden="true" /> New student
                  </Button>
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <ErrorState
                title="Failed to load payments"
                description="Check your connection and retry."
                onRetry={() => toast.warning('Retry (demo)')}
              />
            </CardContent>
          </Card>
        </div>
      </DemoSection>

      <DemoSection
        title="Alert dialog"
        description="Accessible confirmation (Radix focus trap, Escape to close)."
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <AlertTriangleIcon aria-hidden="true" /> Destructive confirm
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes the selected records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => toast.success('Confirmed (demo)')}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DemoSection>

      <Separator />
      <p className="text-muted-foreground text-caption text-center">
        {t('designSystem.preview')} · v0.1
      </p>
    </PageContainer>
  )
}
