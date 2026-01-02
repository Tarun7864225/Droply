import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger" | "warning" | "success" | "default";
  onConfirm: () => void;
  isDangerous?: boolean;
  warningMessage?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
  onConfirm,
  isDangerous = false,
  warningMessage,
}) => {
  return (
    <Modal hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "bg-white border border-gray-200 shadow-xl rounded-xl",
        header: "px-6 py-4 border-b border-gray-200",
        body: "px-6 py-4",
        footer: "px-6 py-4 border-t border-gray-200 flex gap-2 justify-end",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 text-gray-900">
          <span className="text-lg font-semibold">{title}</span>
        </ModalHeader>

        <ModalBody className="space-y-4 text-gray-700">
          {isDangerous && warningMessage && (
            <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-danger">
                    This action cannot be undone
                  </p>
                  <p className="mt-1 text-sm text-danger-700">
                    {warningMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed">{description}</p>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            color="default"
            className="min-w-[96px]"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>

          <Button
            color={confirmColor}
            className="min-w-[140px] font-medium"
            startContent={Icon && <Icon className="h-4 w-4" />}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
};

export default ConfirmationModal;