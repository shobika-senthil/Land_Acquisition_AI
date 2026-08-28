import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Compass,
  ChevronRight,
  Download,
  AlertTriangle,
} from 'lucide-react';

import { projectService } from '../../services/projectService';
import { parcelService } from '../../services/parcelService';
import { reportService } from '../../services/reportService';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { RiskScore } from '../../components/ui/RiskScore';
import { DemoBanner } from '../../components/ui/DemoBanner';

import {
  Project,
  TimelinePhaseStatus,
  Parcel,
} from '../../types';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(undefined);
  const [projectParcels, setProjectParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      if (!id) {
        setError('Project ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Only request that actually exists in the backend.
        const fetchedProject =
          await projectService.getProjectById(id);

        if (!mounted) return;

        if (!fetchedProject) {
          setProject(undefined);
          setProjectParcels([]);
          setError('Project not found.');
          setLoading(false);
          return;
        }

        // Project comes directly from the backend.
        setProject(fetchedProject);

        // Parcels are local frontend data, so no API call is made.
        const parcels =
          parcelService.getParcelsByProject(
            fetchedProject.id
          );

        setProjectParcels(
          Array.isArray(parcels) ? parcels : []
        );

        // Stop loading as soon as project data is available.
        setLoading(false);

      } catch (loadError) {
        console.error(
          'Failed to load project:',
          loadError
        );

        if (mounted) {
          setError(
            'Unable to load project from the backend.'
          );
          setProject(undefined);
          setProjectParcels([]);
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      mounted = false;
    };
  }, [id]);

  const getStatusBadge = (
    status: TimelinePhaseStatus
  ) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-olive-100 text-olive-800 border border-olive-300">
            COMPLETED
          </span>
        );

      case 'IN_PROGRESS':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sandal-200 text-earth-800 border border-sandal-300">
            IN PROGRESS
          </span>
        );

      case 'AT_RISK':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-terracotta-100 text-terracotta-800 border border-terracotta-300">
            AT RISK
          </span>
        );

      case 'DELAYED':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-risk-critical-bg text-risk-critical border border-risk-critical-border animate-pulse">
            DELAYED
          </span>
        );

      case 'UPCOMING':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sandal-100 text-earth-500 border border-sandal-200">
            UPCOMING
          </span>
        );
    }
  };

  const handleExportBrief = () => {
    if (!project) return;

    reportService.generateReport({
      title: `${project.name} Risk Dossier`,
      type: 'Project Risk Dossier',
      state: project.state,
      district: project.district,
      project: project.name,
      author: 'DoLR Automated Intelligence Engine',
    });

    navigate('/reports');
  };

  // Loading only waits for the real project API.
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 px-4 text-center">
        <div className="max-w-md mx-auto">

          <div className="w-10 h-10 border-4 border-sandal-300 border-t-earth-900 rounded-full animate-spin mx-auto" />

          <h2 className="text-lg font-bold text-earth-950 mt-5">
            Loading Project
          </h2>

          <p className="text-xs text-earth-600 mt-2">
            Fetching project information from the backend...
          </p>

        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-ivory pt-24 px-4 text-center max-w-md mx-auto">

        <h2 className="text-xl font-bold text-earth-950">
          Corridor Not Found
        </h2>

        <p className="text-xs text-earth-600 mt-2">
          {error ||
            'The requested infrastructure project ID is not in our registry.'}
        </p>

        <Link
          to="/projects"
          className="mt-4 inline-block px-4 py-2 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl"
        >
          Return to Directory
        </Link>

      </div>
    );
  }

  const acquisitionPercentage =
    project.totalParcels > 0
      ? Math.round(
          (project.acquiredParcels /
            project.totalParcels) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <DemoBanner />

      {/* Back + Actions */}
      <div className="mt-6 mb-4 flex items-center justify-between">

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-earth-600 hover:text-earth-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Directory</span>
        </Link>

        <div className="flex items-center gap-2">

          <button
            onClick={handleExportBrief}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-ivory text-earth-800 border border-sandal-300 hover:bg-sandal-100 text-xs font-semibold rounded-xl shadow-sandal-sm"
          >
            <Download className="w-3.5 h-3.5 text-earth-600" />
            <span>Generate Risk Dossier</span>
          </button>

          <Link
            to="/gis-risk-map"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-earth-900 text-sandal-100 hover:bg-earth-950 text-xs font-bold rounded-xl shadow-sandal"
          >
            <Compass className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Live GIS View</span>
          </Link>

        </div>
      </div>

      {/* Project Header */}
      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="space-y-2">

            <div className="flex items-center gap-2">

              <span className="font-mono text-xs font-bold text-earth-500 bg-sandal-100 px-2.5 py-0.5 rounded border border-sandal-200">
                {project.code}
              </span>

              <span className="text-xs font-semibold text-earth-600">
                {project.sector}
              </span>

            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-semibold text-earth-950 tracking-tight leading-tight">
              {project.name}
            </h1>

            <p className="text-sm text-earth-600 flex items-center gap-2 flex-wrap">

              <MapPin className="w-4 h-4 text-terracotta-600" />

              <span>
                {project.district}, {project.state}
              </span>

              <span>•</span>

              <span>
                Land Area:{' '}
                <strong>
                  {project.lengthKm} hectares
                </strong>
              </span>

              <span>•</span>

              <span>
                Budget:{' '}
                <strong>
                  ₹{project.budgetCr.toLocaleString()} Cr
                </strong>
              </span>

            </p>

          </div>

          {/* Risk */}
          <div className="flex-shrink-0 bg-cream-light p-5 rounded-2xl border border-sandal-300">

            <RiskScore
              score={project.riskScore}
              size="lg"
            />

            <div className="mt-2 pt-2 border-t border-sandal-200 text-right">

              <span className="text-[11px] text-earth-500 uppercase font-bold block">
                AI Delay Probability
              </span>

              <span className="text-base font-extrabold text-earth-950">
                {project.delayProbability}%
              </span>

              <span className="block text-[11px] font-bold text-earth-600 mt-0.5">
                AI Risk: {project.riskLevel}
              </span>

            </div>

          </div>

        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-sandal-200">

          <p className="text-sm text-earth-700 leading-relaxed max-w-4xl">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">

            <span className="text-[10px] uppercase font-bold text-earth-500">
              Backend AI Assessment
            </span>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-earth-900 text-sandal-100">
              {project.delayProbability}% delay probability
            </span>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-olive-100 text-olive-800 border border-olive-300">
              {project.riskLevel} RISK
            </span>

          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

        <div className="bg-ivory p-4 rounded-2xl border border-sandal-300 shadow-sandal-sm">

          <span className="text-[10px] uppercase font-bold text-earth-500">
            Parcels Acquired
          </span>

          <p className="text-2xl font-extrabold text-earth-950 mt-1">

            {project.acquiredParcels}{' '}

            <span className="text-xs font-normal text-earth-500">
              / {project.totalParcels}
            </span>

          </p>

          <span className="text-xs text-olive-700 font-semibold">
            {acquisitionPercentage}% Completed
          </span>

        </div>


        <div className="bg-ivory p-4 rounded-2xl border border-terracotta-200 shadow-sandal-sm">

          <span className="text-[10px] uppercase font-bold text-terracotta-700">
            Affected Cadastral Plots
          </span>

          <p className="text-2xl font-extrabold text-terracotta-700 mt-1">
            {project.affectedParcelsCount}
          </p>

          <span className="text-xs text-earth-600">
            Pending Acquisition Process
          </span>

        </div>


        <div className="bg-ivory p-4 rounded-2xl border border-risk-critical-border shadow-sandal-sm">

          <span className="text-[10px] uppercase font-bold text-risk-critical">
            Critical Litigation Plots
          </span>

          <p className="text-2xl font-extrabold text-risk-critical mt-1">
            {project.criticalParcelsCount}
          </p>

          <span className="text-xs text-risk-critical font-medium">
            Requiring Attention
          </span>

        </div>


        <div className="bg-ivory p-4 rounded-2xl border border-sandal-300 shadow-sandal-sm">

          <span className="text-[10px] uppercase font-bold text-earth-500">
            Current Status
          </span>

          <p className="text-xl font-extrabold text-earth-950 mt-2">
            {project.status}
          </p>

          <span className="text-xs text-earth-500">
            Current acquisition stage
          </span>

        </div>

      </div>

      {/* Timeline */}
      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-sandal-200 gap-2">

          <div>

            <span className="text-[10px] font-mono uppercase font-bold text-terracotta-700 tracking-wider">
              Statutory RFCTLARR & NHAI Process
            </span>

            <h3 className="text-xl font-display font-semibold text-earth-950">
              Land Acquisition Timeline
            </h3>

          </div>

          {project.timeline.length > 0 && (
            <span className="text-xs font-semibold text-risk-critical bg-risk-critical-bg px-3 py-1 rounded-full border border-risk-critical-border">
              Timeline available
            </span>
          )}

        </div>

        {project.timeline.length === 0 ? (

          <div className="py-10 text-center">

            <AlertTriangle className="w-8 h-8 mx-auto text-earth-400" />

            <p className="text-sm font-semibold text-earth-700 mt-3">
              Timeline data not available yet
            </p>

            <p className="text-xs text-earth-500 mt-1">
              Detailed project milestones will be connected to the backend next.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {project.timeline.map((phase) => (

              <div
                key={phase.id}
                className={`p-4 rounded-2xl border transition-all ${
                  phase.status === 'DELAYED'
                    ? 'bg-risk-critical-bg/50 border-risk-critical-border shadow-sandal-sm'
                    : phase.status === 'COMPLETED'
                    ? 'bg-olive-50/60 border-olive-200'
                    : 'bg-cream-light border-sandal-200'
                }`}
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                  <div className="flex items-center gap-3">

                    <span className="w-6 h-6 rounded-full bg-earth-900 text-sandal-100 flex items-center justify-center text-xs font-bold">
                      {phase.stageNumber}
                    </span>

                    <div>

                      <h4 className="text-sm font-bold text-earth-950">
                        {phase.name}
                      </h4>

                      <p className="text-xs text-earth-600">
                        Scheduled: {phase.scheduledEnd}
                        {' • '}
                        Forecast:{' '}

                        <strong
                          className={
                            phase.delayDays > 0
                              ? 'text-risk-critical'
                              : 'text-earth-900'
                          }
                        >
                          {phase.forecastEnd}
                        </strong>

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">

                    {phase.delayDays > 0 && (
                      <span className="text-xs font-bold text-risk-critical">
                        +{phase.delayDays} Days Overdue
                      </span>
                    )}

                    {getStatusBadge(phase.status)}

                  </div>

                </div>

                {phase.bottleneckReason && (

                  <div className="mt-3 pt-2.5 border-t border-risk-critical-border/50 flex items-center gap-2 text-xs text-risk-critical font-medium">

                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />

                    <span>
                      Bottleneck: {phase.bottleneckReason}
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Parcels */}
      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal">

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-sandal-200">

          <div>

            <h3 className="text-xl font-display font-semibold text-earth-950">
              Affected Cadastral Plots ({projectParcels.length})
            </h3>

            <p className="text-xs text-earth-600 mt-0.5">
              Directly associated with the {project.name} project.
            </p>

          </div>

          <Link
            to="/gis-risk-map"
            className="text-xs font-bold text-earth-900 hover:text-terracotta-600 flex items-center gap-1"
          >
            <span>View on GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

        </div>

        {projectParcels.length === 0 ? (

          <div className="py-10 text-center">

            <p className="text-sm font-semibold text-earth-700">
              No parcel records available for this project yet.
            </p>

            <p className="text-xs text-earth-500 mt-1">
              Parcel data will be connected to the backend in the GIS integration stage.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead>

                <tr className="border-b border-sandal-200 text-earth-500 font-bold uppercase tracking-wider">

                  <th className="pb-3">
                    Plot / Survey #
                  </th>

                  <th className="pb-3">
                    Village / Taluk
                  </th>

                  <th className="pb-3">
                    Area
                  </th>

                  <th className="pb-3">
                    Ownership
                  </th>

                  <th className="pb-3">
                    Litigations
                  </th>

                  <th className="pb-3">
                    Risk Score
                  </th>

                  <th className="pb-3 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-sandal-200">

                {projectParcels.map((parcel) => (

                  <tr
                    key={parcel.id || parcel.plotId}
                    className="hover:bg-sandal-50/60 transition-colors"
                  >

                    <td className="py-3.5 font-bold text-earth-950">

                      Plot {parcel.plotId}

                      <span className="block font-mono text-[10px] text-earth-500 font-normal">
                        {parcel.surveyNumber}
                      </span>

                    </td>

                    <td className="py-3.5 text-earth-700">
                      {parcel.village || '—'}, {parcel.taluk || '—'}
                    </td>

                    <td className="py-3.5 font-semibold text-earth-900">
                      {parcel.areaAcres} Acres
                    </td>

                    <td className="py-3.5 text-earth-700">
                      {parcel.ownershipType} ({parcel.ownerCount} Heirs)
                    </td>

                    <td className="py-3.5">

                      {parcel.legalDisputeCount > 0 ? (

                        <span className="font-bold text-risk-critical">
                          {parcel.legalDisputeCount} Suits
                        </span>

                      ) : (

                        <span className="text-olive-700 font-medium">
                          None
                        </span>

                      )}

                    </td>

                    <td className="py-3.5">

                      <RiskBadge
                        level={parcel.riskLevel}
                        size="sm"
                      />

                    </td>

                    <td className="py-3.5 text-right">

                      <Link
                        to={`/parcels/${parcel.id || parcel.plotId}`}
                        className="font-bold text-terracotta-700 hover:text-terracotta-900"
                      >
                        Inspect →
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};