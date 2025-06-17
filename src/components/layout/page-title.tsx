import { usePageTitle } from "../../hooks/use-page-title"
import { Button } from "../ui/button"
import { SVGInline } from "../ui/SVGInline/SVGInline"

export function PageTitle() {
  const { title } = usePageTitle()
  return (
    <div className="flex gap-3">
      <Button
        isRounded
        variant="outline"
        iconLeft={<SVGInline src="/icon/ArrowLeft.svg" />}
        iconOnly
        aria-label="Notifications"
      />
      <span className="text-base-foreground text-2xl leading-8 font-semibold">
        {title}
      </span>
    </div>
  )
}

export default { PageTitle }
