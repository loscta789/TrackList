"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

interface ConfirmActionProps {
  onClose: () => void;
}

export default function ConfirmAction({ onClose }: ConfirmActionProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="p-6 rounded-lg shadow-xl w-96 bg-background border border-secondary">
          <h2 className="text-xl font-bold text-foreground mb-2">Leave Group</h2>
          
          <p className="text-secondary mb-4">Are you sure you want to proceed with this action?</p>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-secondary text-foreground hover:bg-secondary/40" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-error text-white hover:bg-error/80">
              Confirm
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
