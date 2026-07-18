"use client";

import { useMemo, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import TimesheetToolbar from "../../components/timesheet/TimesheetToolbar";
import TimesheetTable from "../../components/timesheet/TimesheetTable";
import TimesheetForm from "../../components/timesheet/TimesheetForm";
import DeleteModal from "../../components/timesheet/DeleteModal";

import useTimesheet from "../../hooks/useTimesheet";

export default function TimesheetPage() {
  const {
    timesheets,
    loading,
    addTimesheet,
    editTimesheet,
    removeTimesheet,
    loadTimesheets,
  } = useTimesheet();

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );

  const [showForm, setShowForm] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((item) => {
      const matchesSearch =
        item.Project?.toLowerCase().includes(search.toLowerCase()) ||
        item.TaskDescription?.toLowerCase().includes(search.toLowerCase());

      const matchesMonth =
        new Date(item.WorkDate).toLocaleString("default", {
          month: "long",
        }) === month;

      return matchesSearch && matchesMonth;
    });
  }, [timesheets, search, month]);

  async function handleSave(formData) {
    try {
      if (selected) {
        await editTimesheet(selected.EntryID, formData);
      } else {
        await addTimesheet(formData);
      }

      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Unable to save timesheet.");
    }
  }

  async function handleDelete() {
    try {
      await removeTimesheet(selected.EntryID);

      setShowDelete(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Unable to delete timesheet.");
    }
  }

  return (
    <MainLayout>

      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        Employee Timesheet
      </h1>

      <TimesheetToolbar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        onRefresh={loadTimesheets}
        onAdd={() => {
          setSelected(null);
          setShowForm(true);
        }}
      />

      <TimesheetTable
        loading={loading}
        timesheets={filteredTimesheets}
        onEdit={(row) => {
          setSelected(row);
          setShowForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setShowDelete(true);
        }}
      />

      <TimesheetForm
        open={showForm}
        editData={selected}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />

      <DeleteModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelected(null);
        }}
        onConfirm={handleDelete}
      />

    </MainLayout>
  );
}