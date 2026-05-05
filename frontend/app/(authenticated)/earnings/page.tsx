"use client"

import { useState } from "react"
import { useHubEarnings, useHubTransactions, useWithdraw } from "@/hooks/usePayments"
import { Button } from "@/components/ui/Button"
import { Card, SectionLabel, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"
import type { WithdrawalRequest } from "@/types/payment"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

// ─── Withdraw Modal ───────────────────────────────────────────────────────────
interface WithdrawModalProps {
  available: number
  currency: string
  onClose: () => void
}

function WithdrawModal({ available, currency, onClose }: WithdrawModalProps) {
  const [form, setForm] = useState<WithdrawalRequest>({
    amount: 0,
    bank_name: "",
    account_number: "",
    account_name: "",
  })
  const [error, setError] = useState<string | null>(null)

  const { mutate: withdraw, isPending } = useWithdraw()

  const set = (key: keyof WithdrawalRequest, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    if (form.amount <= 0) return setError("Enter a valid amount.")
    if (form.amount > available) return setError("Amount exceeds available balance.")
    if (!form.bank_name || !form.account_number || !form.account_name)
      return setError("All fields are required.")

    setError(null)
    withdraw(form, {
      onSuccess: () => onClose(),
      onError: (err: any) => setError(err?.detail ?? "Withdrawal failed. Try again."),
    })
  }

  const fields: { key: keyof WithdrawalRequest; label: string; type?: string; placeholder: string }[] = [
    { key: "bank_name",       label: "Bank Name",      placeholder: "e.g. Zenith Bank"     },
    { key: "account_number",  label: "Account Number", placeholder: "e.g. 0123456789"      },
    { key: "account_name",    label: "Account Name",   placeholder: "e.g. Lola Adebayo"    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,15,20,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[420px] rounded-2xl border border-[#EDE9F6] overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(108,54,245,0.16)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5 border-b border-[#F5F3FF]">
          <h3 className="font-display text-[18px] font-bold text-[#0F0F14]">Request Withdrawal</h3>
          <p className="font-body text-[12.5px] text-[#9CA3AF] mt-1">
            Available: <strong className="text-[#6C36F5]">{formatAmount(available, currency)}</strong>
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Amount */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">Amount ({currency})</label>
            <input
              type="number"
              min={1}
              max={available}
              value={form.amount || ""}
              onChange={e => set("amount", Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#FAFAFA] border border-[#EDE9F6] rounded-[10px] px-4 py-2.5 text-[14px] font-bold text-[#0F0F14] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C36F5] focus:ring-2 focus:ring-[#6C36F5]/10 transition-all"
            />
          </div>

          {/* Bank fields */}
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">{label}</label>
              <input
                value={form[key] as string}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#FAFAFA] border border-[#EDE9F6] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#0F0F14] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C36F5] focus:ring-2 focus:ring-[#6C36F5]/10 transition-all"
              />
            </div>
          ))}

          {error && (
            <p className="text-[12.5px] text-red-500 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2">{error}</p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-[10px] text-[13px] font-semibold text-[#6B7280] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 rounded-[10px] text-[13.5px] font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "#6C36F5", boxShadow: "0 4px 16px rgba(108,54,245,0.35)" }}
          >
            {isPending ? "Requesting…" : "Request Payout"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Transaction status badge ─────────────────────────────────────────────────
function TxStatus({ status }: { status: "pending" | "success" | "failed" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border",
      status === "success" && "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
      status === "pending" && "bg-[#F5F3FF] text-[#6C36F5] border-[#DDD6FE]",
      status === "failed"  && "bg-red-50 text-red-600 border-red-200",
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full shrink-0",
        status === "success" && "bg-[#16A34A]",
        status === "pending" && "bg-[#6C36F5]",
        status === "failed"  && "bg-red-500",
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreatorEarningsPage() {
  const [showWithdraw, setShowWithdraw] = useState(false)

  const { data: earnings, isLoading: earningsLoading } = useHubEarnings()
  const { data: transactions = [], isLoading: txLoading } = useHubTransactions()

  const currency         = earnings?.currency ?? "NGN"
  const totalEarned      = earnings?.total_earned ?? 0
  const totalWithdrawn   = earnings?.total_withdrawn ?? 0
  const availableBalance = earnings?.available_balance ?? 0

  // Split into success vs pending for display
  const successTx = transactions.filter(t => t.status === "success")
  const pendingTx = transactions.filter(t => t.status === "pending")

  // Last month's earnings approximation: sum of success transactions in current month
  const thisMonth = new Date().getMonth()
  const thisMonthTx = successTx.filter(t => new Date(t.created_at).getMonth() === thisMonth)
  const thisMonthTotal = thisMonthTx.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <main className="flex-1 px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-[24px] font-bold text-[#0F0F14] tracking-tight">Earnings</h1>
            <p className="font-body text-[13px] text-[#9CA3AF] mt-1">Your revenue breakdown and payout history</p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowWithdraw(true)}
            disabled={availableBalance <= 0}
          >
            Withdraw Funds
          </Button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {earningsLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} padding="md">
                <div className="h-[72px] animate-pulse bg-[#F5F3FF] rounded-xl" />
              </Card>
            ))
          ) : (
            <>
              <Card padding="md">
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">Total Earned</p>
                <p className="font-display text-[26px] font-bold text-[#0F0F14] leading-none">
                  {formatAmount(totalEarned, currency)}
                </p>
                <p className="font-body text-[12px] mt-1.5 text-[#9CA3AF]">All-time gross revenue</p>
              </Card>

              <Card padding="md">
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">Total Withdrawn</p>
                <p className="font-display text-[26px] font-bold text-[#0F0F14] leading-none">
                  {formatAmount(totalWithdrawn, currency)}
                </p>
                <p className="font-body text-[12px] mt-1.5 text-[#9CA3AF]">All-time payouts</p>
              </Card>

              <Card padding="md">
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">Available Balance</p>
                <p className="font-display text-[26px] font-bold text-[#0F0F14] leading-none">
                  {formatAmount(availableBalance, currency)}
                </p>
                <p className={cn("font-body text-[12px] mt-1.5", availableBalance > 0 ? "text-[#10B981]" : "text-[#9CA3AF]")}>
                  {availableBalance > 0 ? "Ready to withdraw" : "Nothing to withdraw yet"}
                </p>
              </Card>
            </>
          )}
        </div>

        {/* This month snapshot */}
        {!earningsLoading && thisMonthTotal > 0 && (
          <Card padding="md" className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-[12px] font-semibold uppercase tracking-wider text-[#9CA3AF]">This Month</p>
                <p className="font-display text-[22px] font-bold text-[#0F0F14] mt-1">{formatAmount(thisMonthTotal, currency)}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-[12px] text-[#9CA3AF]">{thisMonthTx.length} successful transactions</p>
                <p className="font-body text-[12px] text-[#6C36F5] mt-1 font-medium">{pendingTx.length} pending</p>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction history */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <h2 className="font-display font-bold text-[17px] text-[#0F0F14]">Transaction History</h2>
            <span className="font-body text-[12px] text-[#9CA3AF]">{transactions.length} transactions</span>
          </div>

          {/* Column headers */}
          <div className="grid gap-4 px-6 py-3.5 bg-[#FAFAFA] border-b border-[#F3F4F6]"
            style={{ gridTemplateColumns: "1fr 130px 130px 160px 100px" }}>
            {["Plan", "Amount", "Date", "Reference", "Status"].map(h => (
              <span key={h} className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {txLoading && (
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[56px] border-b border-[#F9FAFB] animate-pulse bg-[#FAFAFA]" />
              ))}
            </div>
          )}

          {!txLoading && transactions.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-body text-[13px] text-[#9CA3AF]">No transactions yet.</p>
            </div>
          )}

          {!txLoading && transactions.map(tx => (
            <div
              key={tx.id}
              className="grid gap-4 items-center px-6 py-4 border-b border-[#F9FAFB] last:border-0 hover:bg-[#FAFAFA] transition-colors"
              style={{ gridTemplateColumns: "1fr 130px 130px 160px 100px" }}
            >
              {/* Plan */}
              <div className="min-w-0">
                <p className="font-display font-semibold text-[13px] text-[#0F0F14] truncate">{tx.plan.name}</p>
                <p className="font-body text-[11.5px] text-[#9CA3AF]">{tx.plan.billing_cycle}</p>
              </div>

              {/* Amount */}
              <span className="font-mono text-[13px] font-bold text-[#0F0F14]">
                {formatAmount(tx.amount, tx.currency)}
              </span>

              {/* Date */}
              <span className="font-body text-[12px] text-[#6B7280]">{formatDate(tx.created_at)}</span>

              {/* Reference */}
              <span className="font-mono text-[11px] text-[#9CA3AF] truncate">{tx.reference}</span>

              {/* Status */}
              <TxStatus status={tx.status} />
            </div>
          ))}
        </Card>

      </main>

      {showWithdraw && earnings && (
        <WithdrawModal
          available={availableBalance}
          currency={currency}
          onClose={() => setShowWithdraw(false)}
        />
      )}
    </div>
  )
}