import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface AlertBannerProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
}

const AlertBanner = ({
  title,
  description,
  variant = 'default',
}: AlertBannerProps) => (
  <>
    {(title || description) && <Alert variant={variant}>
      <AlertCircle className="h-4 w-4 inline" />
      <AlertTitle>
        {title}
      </AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>}
  </>
)

export default AlertBanner