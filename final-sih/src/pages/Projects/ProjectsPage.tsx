import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
  Link,
} from 'react-router-dom';

import {
  Search,
  Plus,
  MapPin,
  ChevronRight,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';

import { projectService } from '../../services/projectService';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { STATES_DATA } from '../../data/states';

import {
  Project,
  RiskLevel,
} from '../../types';


export const ProjectsPage: React.FC = () => {

  const navigate = useNavigate();

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedState, setSelectedState] =
    useState('All');

  const [selectedSector, setSelectedSector] =
    useState('All');

  const [selectedRisk, setSelectedRisk] =
    useState<string>('All');

  const [selectedStatus, setSelectedStatus] =
    useState('All');


  // =========================================================
  // PROJECT DATA
  // =========================================================

  const [allProjects, setAllProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // =========================================================
  // PAGINATION
  // =========================================================

  const PROJECTS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] =
    useState(1);


  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  useEffect(() => {

    let cancelled = false;

    const loadProjects = async () => {

      try {

        setLoading(true);
        setError(null);

        const result =
          await projectService.getAllProjects();

        if (!cancelled) {

          setAllProjects(
            Array.isArray(result)
              ? result
              : []
          );

        }

      } catch (err) {

        console.error(
          'Failed to load projects:',
          err
        );

        if (!cancelled) {

          setAllProjects([]);

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load projects.'
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    loadProjects();

    return () => {
      cancelled = true;
    };

  }, []);


  // =========================================================
  // PREPARE SEARCH DATA ONCE
  // =========================================================

  const searchableProjects = useMemo(() => {

    return allProjects.map((project) => {

      const searchText = [
        project.id,
        project.code,
        project.name,
        project.district,
        project.state,
        project.sector,
        project.summary,
        project.topDelayDriver,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return {
        project,
        searchText,
      };

    });

  }, [allProjects]);


  // =========================================================
  // FILTER PROJECTS
  // =========================================================

  const projects = useMemo(() => {

    const search =
      searchQuery.trim().toLowerCase();

    return searchableProjects
      .filter(({ project, searchText }) => {

        if (
          selectedState !== 'All' &&
          project.state !== selectedState
        ) {
          return false;
        }

        if (
          selectedSector !== 'All' &&
          project.sector !== selectedSector
        ) {
          return false;
        }

        if (
          selectedRisk !== 'All' &&
          project.riskLevel !==
            (selectedRisk as RiskLevel)
        ) {
          return false;
        }

        if (
          selectedStatus !== 'All' &&
          project.status !== selectedStatus
        ) {
          return false;
        }

        if (
          search &&
          !searchText.includes(search)
        ) {
          return false;
        }

        return true;

      })
      .map(({ project }) => project);

  }, [
    searchableProjects,
    searchQuery,
    selectedState,
    selectedSector,
    selectedRisk,
    selectedStatus,
  ]);


  // =========================================================
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedState,
    selectedSector,
    selectedRisk,
    selectedStatus,
  ]);


  // =========================================================
  // PAGINATED PROJECTS
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      projects.length /
        PROJECTS_PER_PAGE
    )
  );

  const paginatedProjects = useMemo(() => {

    const startIndex =
      (currentPage - 1) *
      PROJECTS_PER_PAGE;

    const endIndex =
      startIndex +
      PROJECTS_PER_PAGE;

    return projects.slice(
      startIndex,
      endIndex
    );

  }, [
    projects,
    currentPage,
  ]);


  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = useMemo(() => {

    const pages: number[] = [];

    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPage - 2
    );

    let endPage = Math.min(
      totalPages,
      startPage + maxVisiblePages - 1
    );

    if (
      endPage - startPage + 1 <
      maxVisiblePages
    ) {

      startPage = Math.max(
        1,
        endPage - maxVisiblePages + 1
      );

    }

    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {

      pages.push(page);

    }

    return pages;

  }, [
    currentPage,
    totalPages,
  ]);


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {

    setSelectedState('All');
    setSelectedSector('All');
    setSelectedRisk('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setCurrentPage(1);

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <DemoBanner />

        <div className="mt-6 mb-8">

          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            National Infrastructure Registry
          </span>

          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            Infrastructure Corridor Directory
          </h1>

          <p className="text-sm text-earth-600 mt-1">
            Loading infrastructure corridors...
          </p>

        </div>

        <div className="bg-ivory rounded-3xl p-12 border border-sandal-300 text-center">

          <div className="animate-pulse">

            <div className="w-10 h-10 rounded-full bg-sandal-200 mx-auto mb-4" />

            <div className="h-4 w-48 bg-sandal-200 rounded mx-auto mb-2" />

            <div className="h-3 w-64 bg-sandal-100 rounded mx-auto" />

          </div>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <DemoBanner />


      {/* HEADER */}

      <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            National Infrastructure Registry
          </span>

          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            Infrastructure Corridor Directory
          </h1>

          <p className="text-sm text-earth-600 mt-1">
            Tracking {projects.length} active land acquisition corridors with machine-learned delay forecasts.
          </p>

        </div>


        <Link
          to="/projects/new"
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth-900 text-sandal-100 font-bold text-xs shadow-sandal hover:bg-earth-950 transition-transform active:scale-95"
        >

          <Plus className="w-4 h-4" />

          <span>
            Register New Corridor
          </span>

        </Link>

      </div>


      {/* SEARCH + FILTERS */}

      <div className="bg-ivory rounded-3xl p-5 border border-sandal-300 shadow-sandal-sm mb-8 space-y-4">

        <div className="relative">

          <Search className="w-4 h-4 text-earth-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search projects by ID, name, code, district, or state..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-light border border-sandal-300 text-xs font-medium text-earth-950 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-earth-800"
          />

        </div>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">


          {/* STATE */}

          <div>

            <label className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">
              State
            </label>

            <select
              value={selectedState}
              onChange={(e) =>
                setSelectedState(e.target.value)
              }
              className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3 py-2 text-xs font-semibold text-earth-900 focus:outline-none"
            >

              <option value="All">
                All States
              </option>

              {STATES_DATA.map((state) => (

                <option
                  key={state.code}
                  value={state.name}
                >
                  {state.name}
                </option>

              ))}

            </select>

          </div>


          {/* SECTOR */}

          <div>

            <label className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">
              Sector
            </label>

            <select
              value={selectedSector}
              onChange={(e) =>
                setSelectedSector(e.target.value)
              }
              className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3 py-2 text-xs font-semibold text-earth-900 focus:outline-none"
            >

              <option value="All">
                All Sectors
              </option>

              <option value="Highway Corridor">
                Highway Corridor
              </option>

              <option value="High-Speed Rail">
                High-Speed Rail
              </option>

              <option value="Industrial Park">
                Industrial Park
              </option>

              <option value="Urban Transit">
                Urban Transit
              </option>

              <option value="Renewable Energy">
                Renewable Energy
              </option>

              <option value="Water Canal">
                Water Canal
              </option>

            </select>

          </div>


          {/* RISK */}

          <div>

            <label className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">
              Risk Severity
            </label>

            <select
              value={selectedRisk}
              onChange={(e) =>
                setSelectedRisk(e.target.value)
              }
              className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3 py-2 text-xs font-semibold text-earth-900 focus:outline-none"
            >

              <option value="All">
                All Risk Levels
              </option>

              <option value="CRITICAL">
                Critical Risk (80+)
              </option>

              <option value="HIGH">
                High Risk (65-79)
              </option>

              <option value="MODERATE">
                Moderate Risk (40-64)
              </option>

              <option value="LOW">
                Low Risk (&lt;40)
              </option>

            </select>

          </div>


          {/* STATUS */}

          <div>

            <label className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">
              Acquisition Stage
            </label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value)
              }
              className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3 py-2 text-xs font-semibold text-earth-900 focus:outline-none"
            >

              <option value="All">
                All Stages
              </option>

              <option value="Pre-Acquisition">
                Pre-Acquisition
              </option>

              <option value="Surveying">
                Surveying
              </option>

              <option value="Disbursement">
                Disbursement
              </option>

              <option value="Possession">
                Possession
              </option>

              <option value="Delayed">
                Delayed
              </option>

              <option value="On Track">
                On Track
              </option>

              <option value="In Progress">
                In Progress
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="bg-ivory rounded-3xl p-10 border border-red-200 text-center max-w-2xl mx-auto mb-8">

          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />

          <h3 className="text-lg font-display font-semibold text-earth-950">
            Unable to load infrastructure data
          </h3>

          <p className="text-sm text-earth-600 mt-2">
            {error}
          </p>

          <p className="text-xs text-earth-500 mt-2">
            Make sure the backend server is running.
          </p>

        </div>

      )}


      {/* PROJECT GRID */}

      {!error && paginatedProjects.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {paginatedProjects.map((project) => (

            <div
              key={project.id}
              onClick={() =>
                navigate(
                  `/projects/${project.id}`
                )
              }
              className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal-sm hover:shadow-sandal hover:border-sandal-400 transition-all cursor-pointer flex flex-col justify-between"
            >

              <div>

                <div className="flex items-center justify-between gap-2 mb-2">

                  <span className="text-[10px] font-mono font-bold text-earth-500 bg-sandal-100 px-2 py-0.5 rounded border border-sandal-200">
                    {project.code}
                  </span>

                  <RiskBadge
                    level={project.riskLevel}
                    size="sm"
                  />

                </div>


                <h3 className="text-lg font-display font-semibold text-earth-950 hover:text-terracotta-700 transition-colors">
                  {project.name}
                </h3>


                <p className="text-xs text-earth-600 mt-1 flex items-center gap-1.5">

                  <MapPin className="w-3.5 h-3.5 text-earth-400" />

                  {project.district}, {project.state} • {project.sector}

                </p>


                <p className="text-xs text-earth-700 mt-3 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>


                <div className="mt-4 pt-3 border-t border-sandal-200">

                  <div className="flex justify-between text-xs font-semibold text-earth-800 mb-1">

                    <span>
                      Acquisition Progress
                    </span>

                    <span>

                      {project.acquiredParcels}
                      {' / '}
                      {project.totalParcels}
                      {' Parcels ('}

                      {project.totalParcels > 0
                        ? Math.round(
                            (project.acquiredParcels /
                              project.totalParcels) *
                              100
                          )
                        : 0}

                      {'%)'}

                    </span>

                  </div>


                  <div className="w-full h-2 rounded-full bg-sandal-200 overflow-hidden">

                    <div
                      style={{
                        width: `${
                          project.totalParcels > 0
                            ? (
                                project.acquiredParcels /
                                project.totalParcels
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="h-full bg-earth-800 rounded-full"
                    />

                  </div>

                </div>


                <div className="mt-3 p-2.5 rounded-xl bg-cream-light border border-sandal-200 text-xs">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                    Top Delay Driver:
                  </span>

                  <span className="font-semibold text-earth-900 mt-0.5 block">
                    {project.topDelayDriver}
                  </span>

                </div>

              </div>


              <div className="mt-5 pt-3 border-t border-sandal-200 flex items-center justify-between text-xs">

                <div>

                  <span className="text-[10px] text-earth-500 font-bold uppercase block">
                    Delay Forecast
                  </span>

                  <span className="font-bold text-risk-critical">
                    +{project.estimatedDelayMonths} Months
                  </span>

                </div>


                <div className="text-right">

                  <span className="text-[10px] text-earth-500 font-bold uppercase block">
                    Budget
                  </span>

                  <span className="font-bold text-earth-900">
                    ₹{project.budgetCr.toLocaleString()} Cr
                  </span>

                </div>


                <span className="font-bold text-earth-900 flex items-center gap-1 hover:text-terracotta-600">

                  Explore

                  <ChevronRight className="w-3.5 h-3.5" />

                </span>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ===================================================
          PAGINATION
      =================================================== */}

      {!error && projects.length > 0 && totalPages > 1 && (

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-earth-600">

            Showing{' '}

            <strong className="text-earth-900">
              {(currentPage - 1) *
                PROJECTS_PER_PAGE +
                1}
            </strong>

            {' - '}

            <strong className="text-earth-900">
              {Math.min(
                currentPage *
                  PROJECTS_PER_PAGE,
                projects.length
              )}
            </strong>

            {' of '}

            <strong className="text-earth-900">
              {projects.length}
            </strong>

            {' projects'}

          </p>


          <div className="flex items-center gap-1.5">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(1, page - 1)
                )
              }
              className="w-9 h-9 rounded-xl border border-sandal-300 bg-ivory flex items-center justify-center text-earth-700 hover:bg-sandal-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >

              <ChevronLeft className="w-4 h-4" />

            </button>


            {/* PAGE NUMBERS */}

            {pageNumbers.map((page) => (

              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-earth-900 text-sandal-100'
                    : 'bg-ivory text-earth-700 border border-sandal-300 hover:bg-sandal-100'
                }`}
              >

                {page}

              </button>

            ))}


            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className="w-9 h-9 rounded-xl border border-sandal-300 bg-ivory flex items-center justify-center text-earth-700 hover:bg-sandal-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >

              <ChevronRight className="w-4 h-4" />

            </button>

          </div>

        </div>

      )}


      {/* ===================================================
          NO RESULTS
      =================================================== */}

      {!error && projects.length === 0 && (

        <div className="bg-ivory rounded-3xl p-12 border border-sandal-300 text-center max-w-lg mx-auto">

          <AlertTriangle className="w-10 h-10 text-earth-400 mx-auto mb-3" />

          <h3 className="text-lg font-display font-semibold text-earth-950">
            No infrastructure corridors match your filter
          </h3>

          <p className="text-xs text-earth-600 mt-1">
            Try clearing some filters or searching for another keyword.
          </p>

          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>

        </div>

      )}

    </div>

  );
};