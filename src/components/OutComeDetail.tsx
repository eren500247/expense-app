import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { TOutcome } from '@/types'
import { displayDate } from '@/lib/services'
import { BiDetail } from "react-icons/bi";


type Props = {
    item : TOutcome
}

const OutComeDetail = ({item}: Props) => {
    const [open,setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full' onClick={()=>setOpen(true)}>Detail <BiDetail /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          
          <div className="grid  grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Label>-</Label>
            <Label className='col-span-2'>{item.amount} MMK</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Remark
            </Label>
            <Label>-</Label>
            <Label>{item.remark ?? "null"}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Category
            </Label>
            <Label>-</Label>
            <Label>{item.category}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Created At
            </Label>
            <Label>-</Label>
            <Label>{displayDate(item.createdAt)}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Updated At
            </Label>
            <Label>-</Label>
            <Label>{displayDate(item.updatedAt)}</Label>
          </div>
         
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdAt" className="text-right">
              Created At
            </Label>
            <div className="col-span-3">
              <DatePicker
                date={formData.createdAt}
                setDate={handleDateChange}
              />
            </div>
          </div> */}
        </div>
       
      </DialogContent>
    </Dialog>
  )
}

export default OutComeDetail