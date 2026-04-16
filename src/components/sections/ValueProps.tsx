import { TrustBadges } from '@/components/ui/TrustBadges'
import { SectionFrame } from '@/components/ui/SectionFrame'

export function ValueProps() {
  return (
    <SectionFrame>
      <div className="bg-[#F9F8F6] section-py-sm">
        <div className="container-content">
          <TrustBadges theme="light" />
        </div>
      </div>
    </SectionFrame>
  )
}
