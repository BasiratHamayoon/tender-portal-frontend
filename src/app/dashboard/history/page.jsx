'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import LineLoader from '@/components/layout/LineLoader';
import { FileText, Tags, Calendar, Search, Building2, User, Hash, Mail, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cover-letters');
  const [coverLetters, setCoverLetters] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      const [clRes, tagRes] = await Promise.all([
        api.get('/cover-letters').catch(() => ({ data: [] })),
        api.get('/tags').catch(() => ({ data: [] }))
      ]);

      const clData = clRes.data?.data || clRes.data || [];
      const tagData = tagRes.data?.data || tagRes.data || [];

      setCoverLetters(Array.isArray(clData) ? clData : []);
      setTags(Array.isArray(tagData) ? tagData : []);
    } catch (error) {
      toast.error('Failed to load history items');
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredCoverLetters = coverLetters.filter((item) => {
    const q = searchQuery.toLowerCase();
    const companyName = item.company?.name || item.company?.code || '';
    return (
      companyName.toLowerCase().includes(q) ||
      (item.itemName && item.itemName.toLowerCase().includes(q)) ||
      (item.addressedTo && item.addressedTo.toLowerCase().includes(q))
    );
  });

  const filteredTags = tags.filter((item) => {
    const q = searchQuery.toLowerCase();
    const companyName = item.company?.name || item.company?.code || '';
    return (
      companyName.toLowerCase().includes(q) ||
      (item.itemName && item.itemName.toLowerCase().includes(q)) ||
      (item.tenderNo && item.tenderNo.toLowerCase().includes(q)) ||
      (item.addressedTo && item.addressedTo.toLowerCase().includes(q))
    );
  });

  if (loading) return <LineLoader />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Document History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse all generated cover letters, item tags, and envelope labels across Crimson Group companies.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, item, tender #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('cover-letters')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'cover-letters'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Cover Letters ({filteredCoverLetters.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'tags'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Tags className="w-4 h-4" />
          Tags & Labels ({filteredTags.length})
        </button>
      </div>

      {/* COVER LETTERS */}
      {activeTab === 'cover-letters' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Addressed To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCoverLetters.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-muted-foreground text-sm">
                      No cover letters found.
                    </td>
                  </tr>
                ) : (
                  filteredCoverLetters.map((cl, i) => (
                    <tr key={cl._id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          {cl.date || (cl.createdAt ? new Date(cl.createdAt).toLocaleDateString() : 'N/A')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 text-[11px] font-mono">
                            {cl.company?.code || 'CI'}
                          </span>
                          <span>{cl.company?.name || 'CRIMSON INTERNATIONAL'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground max-w-xs truncate">
                        {cl.itemName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-sm truncate">
                        {cl.addressedTo || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCoverLetters.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No cover letters found.</div>
            ) : (
              filteredCoverLetters.map((cl, i) => (
                <div key={cl._id || i} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-600 dark:text-red-400">{cl.company?.name || 'CRIMSON INTERNATIONAL'}</span>
                    <span className="text-muted-foreground font-mono">{cl.date || 'N/A'}</span>
                  </div>
                  <div className="text-sm font-semibold">{cl.itemName}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{cl.addressedTo}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAGS & LABELS */}
      {activeTab === 'tags' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Tag Type</th>
                  <th className="px-6 py-4">Details / Recipient</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTags.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-muted-foreground text-sm">
                      No tags found.
                    </td>
                  </tr>
                ) : (
                  filteredTags.map((tag, i) => (
                    <tr key={tag._id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {tag.createdAt ? new Date(tag.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[11px] font-mono">
                            {tag.company?.code || 'CI'}
                          </span>
                          <span>{tag.company?.name || 'CRIMSON INTERNATIONAL'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {tag.type === 'envelope-tag' ? (
                            <Mail className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <TagIcon className="w-3 h-3 text-blue-500" />
                          )}
                          {tag.type?.replace(/-/g, ' ') || 'Tag'}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        {tag.type === 'envelope-tag' ? (
                          <div className="space-y-0.5">
                            {tag.tenderNo && <div className="font-semibold text-xs text-foreground">Tender: {tag.tenderNo}</div>}
                            {tag.addressedTo && <div className="text-xs text-muted-foreground truncate">{tag.addressedTo}</div>}
                          </div>
                        ) : (
                          <div className="font-semibold text-foreground">{tag.itemName || 'N/A'}</div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTags.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No tags found.</div>
            ) : (
              filteredTags.map((tag, i) => (
                <div key={tag._id || i} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{tag.company?.name || 'CRIMSON INTERNATIONAL'}</span>
                    <span className="capitalize text-muted-foreground font-mono">{tag.type?.replace(/-/g, ' ')}</span>
                  </div>
                  {tag.itemName && <div className="text-sm font-semibold">{tag.itemName}</div>}
                  {tag.tenderNo && <div className="text-xs font-mono">Tender No: {tag.tenderNo}</div>}
                  {tag.addressedTo && <div className="text-xs text-muted-foreground line-clamp-2">{tag.addressedTo}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}