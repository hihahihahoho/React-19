import { CheckCheck, XCircle } from "lucide-react";
import { Button } from "../button";
import { useDataTable } from "./data-table-context";
import { AnimatePresence, motion } from "motion/react";

export function DataTableSelection() {
  const { table } = useDataTable();
  return (
    <AnimatePresence>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="sticky left-0 right-0 z-30 flex items-center justify-center mb-4 text-xs pointer-events-none bottom-20">
          <motion.div
            className="flex flex-wrap items-center gap-2 px-4 py-3 border pointer-events-auto rounded-xl bg-card/90 backdrop-blur -sm:flex-col"
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
                  });
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
                  });
                }}
                size={"xs"}
                variant={"outline"}
              >
                <XCircle />
                Bỏ chọn tất cả
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
