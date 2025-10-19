"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import axios, { AxiosResponse } from "axios"

interface TransferMoneyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  childName: string
}

interface PayoutItem {
  recipient_type: "EMAIL"
  amount: { value: string; currency: string }
  receiver: string
  note?: string
  sender_item_id: string
}

interface PayoutPayload {
  sender_batch_header: {
    sender_batch_id: string
    email_subject: string
  }
  items: PayoutItem[]
}

interface PayoutResponse {
  batch_header?: {
    payout_batch_id: string
    batch_status: string
  }
  [key: string]: any
}

export function TransferMoneyModal({ open, onOpenChange, childName }: TransferMoneyModalProps) {
  const [amount, setAmount] = useState("")

  const CLIENT_ID =
    "AR2g3t6K6ml4SHq8qsos5CoF8wL0S0toZQdCm4LroBKYTMv0XDNd2tAitsqXuwQXYmcGHBbAY714rW2n"
  const CLIENT_SECRET =
    "ECnoFCZwhjYsyE25Xlc6rfgLbCocmCh9HkiPLfcY-4X8VmDk2rB_O6bV0VZdkFNxbRHysM9Sya72UJ9V"
  const ENV: "sandbox" | "live" = "sandbox"

  const API_BASE =
    ENV === "sandbox"
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com"

  const OAUTH_URL = `${API_BASE}/v1/oauth2/token`
  const PAYOUTS_URL = `${API_BASE}/v1/payments/payouts`

  // ---- PayPal logic ----
  const getAccessToken = async (): Promise<string> => {
    const response: AxiosResponse<{ access_token: string }> = await axios({
      method: "post",
      url: OAUTH_URL,
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      headers: { Accept: "application/json", "Accept-Language": "en_US" },
      data: "grant_type=client_credentials",
    })
    return response.data.access_token
  }

  const createPayout = async (
    accessToken: string,
    senderBatchId: string,
    senderEmail: string,
    recipientEmail: string,
    amount: string,
    currency = "USD"
  ): Promise<PayoutResponse> => {
    const payload: PayoutPayload = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: "You have a payout!",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: { value: amount, currency },
          receiver: recipientEmail,
          note: `Payout from ${senderEmail}`,
          sender_item_id: `item_${senderBatchId}_1`,
        },
      ],
    }

    const response: AxiosResponse<PayoutResponse> = await axios.post(PAYOUTS_URL, payload, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    })

    return response.data
  }

  const getPayoutStatus = async (
    accessToken: string,
    payoutBatchId: string
  ): Promise<PayoutResponse> => {
    const response: AxiosResponse<PayoutResponse> = await axios.get(
      `${PAYOUTS_URL}/${payoutBatchId}`,
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  const sendPayoutWithPolling = async (
    senderEmail: string,
    recipientEmail: string,
    amount: string,
    currency = "USD",
    pollInterval = 2000,
    maxAttempts = 15
  ): Promise<PayoutResponse> => {
    const accessToken = await getAccessToken()
    const senderBatchId = `batch_${Date.now()}`

    const payoutResponse = await createPayout(accessToken, senderBatchId, senderEmail, recipientEmail, amount, currency)
    const batchId = payoutResponse.batch_header?.payout_batch_id
    if (!batchId) throw new Error("Failed to create payout batch.")

    const finalStatuses = new Set(["SUCCESS", "COMPLETED", "DENIED", "FAILED"])
    let attempts = 0
    let details: PayoutResponse | null = null

    while (attempts < maxAttempts) {
      details = await getPayoutStatus(accessToken, batchId)
      const status = details.batch_header?.batch_status
      if (status && finalStatuses.has(status)) break
      await new Promise((res) => setTimeout(res, pollInterval))
      attempts++
    }

    return details!
  }

  // ---- Submit handler ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Transferring money:", { childName, amount })

    try {
      const senderEmail = "sb-3tr4b47067362@personal.example.com"
      const recipientEmail = "sb-vhaxv47069972@business.example.com"
      const result = await sendPayoutWithPolling(senderEmail, recipientEmail, amount)
      console.log("Payout result:", result)
    } catch (error: any) {
      console.error("Error sending payout:", error.response?.data || error.message)
    }

    onOpenChange(false)
    setAmount("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Transfer Money</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Transfer funds to {childName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-secondary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6"
          >
            Transfer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
