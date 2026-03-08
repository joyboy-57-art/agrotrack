import React from 'react';
import { cn } from '../lib/utils';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-2xl bg-gray-100", className)}
            {...props}
        />
    );
};

const SkeletonLoader = ({ type = "card", count = 1 }) => {
    const renderers = {
        card: (key) => (
            <div key={key} className="card-premium p-6 bg-white overflow-hidden">
                <Skeleton className="h-48 w-full mb-6 rounded-2xl" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </div>
        ),
        table: (key) => (
            <div key={key} className="flex items-center space-x-4 py-4 px-8 border-b border-gray-50">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/6" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
            </div>
        ),
        stats: (key) => (
            <div key={key} className="card-premium p-8 bg-white flex items-center space-x-6">
                <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-8 w-1/2" />
                </div>
            </div>
        )
    };

    return (
        <div className={cn(
            "w-full",
            type === "card" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            type === "stats" && "grid grid-cols-1 md:grid-cols-3 gap-6",
            type === "table" && "card-premium divide-y divide-gray-50 bg-white"
        )}>
            {Array.from({ length: count }).map((_, i) => renderers[type](i))}
        </div>
    );
};

export { Skeleton, SkeletonLoader };
