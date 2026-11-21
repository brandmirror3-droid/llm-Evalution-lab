import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-12">
        <EmptyState
          icon={<HelpCircle className="w-6 h-6 text-amber-400" />}
          title="404 — Research Module or Page Not Found"
          description="The requested route does not exist in LLM Evaluation Lab. Please verify the URL or return to the laboratory overview."
          action={
            <Link to="/">
              <Button variant="primary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Return to Lab Overview
              </Button>
            </Link>
          }
        />
      </div>
    </PageContainer>
  );
};
