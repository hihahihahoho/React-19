import { CheckCheck, XCircle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "../button"
import { useDataTable } from "./data-table-context"

function DataTableSelection({
  extendActions,
}: {
  extendActions?: React.ReactNode
}) {
  const { table } = useDataTable()
  return (
    <AnimatePresence>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="pointer-events-none sticky right-0 bottom-4 left-0 z-50 mb-2 flex items-center justify-center pt-2 text-xs">
          <motion.div
            className="bg-card/90 pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 backdrop-blur-sm max-sm:flex-col"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.8,
              filter: "blur(24px)",
            }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              type: "spring",
              bounce: 0.3,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(24px)" }}
          >
            <span>
              Đã chọn <b>{table.getSelectedRowModel().rows.length}</b>/
              {table.getCoreRowModel().rows.length} bản ghi
            </span>
            <div className="flex gap-2 whitespace-nowrap">
              <Button
                onClick={() => {
                  table?.getToggleAllRowsSelectedHandler()?.({
                    target: { checked: true },
                  })
                }}
                size={"xs"}
                variant={"outline"}
              >
                <CheckCheck />
                Chọn tất cả
              </Button>
              <Button
                onClick={() => {
                  table?.getToggleAllRowsSelectedHandler()?.({
                    target: { checked: false },
                  })
                }}
                size={"xs"}
                variant={"outline"}
              >
                <XCircle />
                Bỏ chọn tất cả
              </Button>
            </div>
            {extendActions}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { DataTableSelection }
