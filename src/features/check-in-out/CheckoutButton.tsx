import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

interface CheckoutButtonProps {
  bookingId: number;
}

function CheckoutButton({ bookingId }: CheckoutButtonProps) {
  const { checkout, isCheckeingOut } = useCheckout();
  return (
    <Button
      variation="danger"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckeingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
