"use client";

import { useEffect, useState } from "react";
import {
  getTimesheets,
  createTimesheet,
  updateTimesheet,
  deleteTimesheet,
} from "../services/timesheet";

export default function useTimesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTimesheets() {
    try {
      setLoading(true);
      setError("");

      const data = await getTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load timesheets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTimesheets();
  }, []);

  async function addTimesheet(formData) {
    await createTimesheet(formData);
    await loadTimesheets();
  }

  async function editTimesheet(entryId, formData) {
    await updateTimesheet(entryId, formData);
    await loadTimesheets();
  }

  async function removeTimesheet(entryId) {
    await deleteTimesheet(entryId);
    await loadTimesheets();
  }

  return {
    timesheets,
    loading,
    error,
    loadTimesheets,
    addTimesheet,
    editTimesheet,
    removeTimesheet,
  };
}