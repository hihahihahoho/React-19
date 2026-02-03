# Alert Dialog System

## Architecture

TungShadcn uses a programmatic Alert Dialog system inspired by `react-hot-toast`. Instead of declaring individual dialog components in your view, you use the `alertDialog()` function.

---

## Global Setup

Ensure `<AlertDialogContainer />` is present in your root layout:

```tsx
// layout.tsx
import { AlertDialogContainer } from "@/components/ui/alert-dialog/alert-dialog-container"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AlertDialogContainer />
      </body>
    </html>
  )
}
```

---

## Programmatic Usage

Import `alertDialog` (aliased from `showAlertDialog`) to trigger a dialog anywhere:

```tsx
import { alertDialog } from "@/hooks/use-alert-dialog"

function DeleteButton() {
  const handleDelete = () => {
    alertDialog({
      title: "Xác nhận xóa?",
      description: "Hành động này không thể hoàn tác.",
      status: "destructive", // "default" | "success" | "warning" | "destructive"
      action: (
        <Button
          variant="destructive"
          onClick={async () => {
            await doDelete()
            // Dialog closes automatically when an Action button is clicked
          }}
        >
          Xóa ngay
        </Button>
      ),
      showCancel: true,
      cancelContent: "Hủy bỏ",
    })
  }

  return <Button onClick={handleDelete}>Delete</Button>
}
```

---

## Status Icons

The `status` prop automatically renders appropriate icons:

- `success`: Check circle
- `warning`: Alert triangle
- `destructive`: Alert circle
- `default`: No icon

---

## Advanced Usage

### Custom Content

You can render any React node in the `content` prop:

```tsx
alertDialog({
  title: "Settings",
  content: <MyCustomSettingsForm />,
  showFooter: false, // Hide default buttons if form has its own
})
```

### Programmatic Dismissal

The function returns an object to update or dismiss the dialog:

```tsx
const { id, dismiss, update } = alertDialog({ title: "Loading..." })

// Later
update({ title: "Complete!" })
// Or
dismiss()
```

### useAlertDialog Hook

Use the hook if you need to access the active dialogs state:

```tsx
const { dialogs, dismiss } = useAlertDialog()
```

---

## Do/Don't

- **Do** use `alertDialog()` for confirmation prompts and simple alerts.
- **Do** use `status="destructive"` for delete operations.
- **Don't** declare `<AlertDialog>` components manually unless you need extreme customization not covered by the hook.
- **Don't** forget the `<AlertDialogContainer />` in the layout.
