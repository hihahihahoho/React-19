import { cn } from "@/lib/utils"
import React from "react"

const VARIANTS = {
  search: "/images/empty-states/search.svg",
  "api-fail": "/images/empty-states/api-fail.svg",
  disconnected: "/images/empty-states/disconnected.svg",
  "empty-data": "/images/empty-states/empty-data.svg",
  maintain: "/images/empty-states/maintain.svg",
  "not-found": "/images/empty-states/not-found.svg",
} as const

type VariantKey = keyof typeof VARIANTS

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  variant?: VariantKey
  title?: string
  description?: string
}

const getDefaultContent = (variant: VariantKey) => {
  const content = {
    search: {
      title: "Không tìm thấy kết quả",
      description: "Hãy thử điều chỉnh từ khóa hoặc bộ lọc tìm kiếm",
    },
    "api-fail": {
      title: "Lỗi kết nối",
      description: "Chúng tôi đang gặp sự cố kết nối đến máy chủ",
    },
    disconnected: {
      title: "Bạn đang ngoại tuyến",
      description: "Vui lòng kiểm tra kết nối internet của bạn",
    },
    "empty-data": {
      title: "Chưa có dữ liệu",
      description: "Không có dữ liệu để hiển thị. Vui lòng tải lại",
    },
    maintain: {
      title: "Đang bảo trì",
      description: "Chúng tôi sẽ sớm trở lại với những cải tiến mới",
    },
    "not-found": {
      title: "Không tìm thấy trang",
      description: "Trang bạn đang tìm kiếm không tồn tại",
    },
  }

  return content[variant]
}

function EmptyState({
  variant = "empty-data",
  title,
  description,
  className,
  children,
  ...props
}: EmptyStateProps) {
  const defaultContent = getDefaultContent(variant)
  const displayTitle = title || defaultContent.title
  const displayDescription = description || defaultContent.description

  return (
    <div
      data-slot="empty-state"
      className={cn("mx-auto w-full rounded-lg p-6 text-center", className)}
      {...props}
    >
      <div className="flex items-center justify-center">
        <img
          src={VARIANTS[variant]}
          alt={`Empty state ${variant}`}
          width={100}
          height={100}
        />
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {displayTitle}
      </h3>

      {displayDescription && (
        <p className="text-muted-foreground mt-2 text-sm">
          {displayDescription}
        </p>
      )}

      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </div>
  )
}

export { EmptyState }
