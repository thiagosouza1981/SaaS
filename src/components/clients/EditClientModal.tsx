"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clientSchema, type ClientFormValues } from "@/schemas/client-schema";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditClientModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: () => void;
}

export function EditClientModal({
  client,
  open,
  onOpenChange,
  onClientUpdated,
}: EditClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Reset form when client changes
  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
      });
    }
  }, [client, form]);

  async function onSubmit(values: ClientFormValues) {
    if (!client) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: values.name,
          email: values.email,
          phone: values.phone,
        })
        .eq("id", client.id);

      if (error) {
        throw error;
      }

      toast.success("Cliente atualizado com sucesso!");
      onOpenChange(false);
      onClientUpdated();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Faça as alterações nos dados do cliente. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}