import { useState } from "react";
import {
  IndexTable,
  Text,
  InlineStack,
  Button,
  ButtonGroup,
  useIndexResourceState,
  useBreakpoints,
  Card,
  Badge,
  BlockStack,
  Pagination,
  TextField,
} from "@shopify/polaris";
import { PlusIcon, DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import "../CSS/ReferrersTable.css";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ReferrersTable({ mappings, onEdit, onDelete, onCreate, itemsPerPage = 20 }) {
  const { selectedResources, allResourcesSelected, handleSelectionChange, setSelectedResources } =
    useIndexResourceState(mappings);
  const breakpoints = useBreakpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState([]);

  const totalPages = Math.ceil(mappings.length / itemsPerPage);

  const filteredMappings = mappings.filter(
    ({ referrers, tag }) =>
      referrers.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMappings = filteredMappings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBulkDelete = () => {
    if (!selectedResources.length) return;
    setDeleteTargets([...selectedResources]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTargets.length) return;
    onDelete(deleteTargets);
    handleSelectionChange("all", false);
    setDeleteModalOpen(false);
    setDeleteTargets([]);
  };

  const rowMarkup = paginatedMappings.map(({ id, referrers, tag, isActive }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell className="cell-referrer">
        <Text>{referrers}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell className="cell-tag">
        <Text>{tag}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell className="cell-status">
        <Badge size="small" tone={isActive ? "success" : ''}>{isActive ? "Active" : "Draft"}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell className="cell-action">
        <InlineStack alignment="trailing" align="end" spacing="tight">
          <ButtonGroup>
            <Button
              size="slim"
              icon={EditIcon}
              onClick={(e) => {
                e.stopPropagation();
                onEdit({ id, referrers, tag, isActive });
              }}
            />
            <Button
              size="slim"
              destructive
              icon={DeleteIcon}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTargets([id]);
                setDeleteModalOpen(true);
              }}
            />
          </ButtonGroup>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const resourceName = { singular: "referrer", plural: "referrers" };

  return (
    <>
      <BlockStack style={{ paddingBottom: "14px", display: "flex", flexDirection: "column" }}>
        <Text as="h4" variant="headingXl" fontWeight="bold">
          Referral Tracking
        </Text>
        <Text as="p" variant="bodyMd">
          Manage referrers for automatic customer tags.
        </Text>
      </BlockStack>
      <Card padding={0}>
        <BlockStack blockalign="center" spacing="tight" style={{ padding: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10 }}>
            <div style={{ flex: 1, maxWidth: "500px" }}>
              <TextField
                placeholder="Search.."
                value={searchQuery}
                onChange={setSearchQuery}
                clearButton
                onClearButtonClick={() => setSearchQuery("")}
              />
            </div>
            <div>
              <Button icon={PlusIcon} variant="primary" size="medium" onClick={() => onCreate()}>
                Add
              </Button>
            </div>
          </div>
        </BlockStack>

        <IndexTable
          condensed={breakpoints.smDown}
          resourceName={resourceName}
          itemCount={filteredMappings.length}
          selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Referrer" },
            { title: "Tag" },
            { title: "Status" },
            { title: "Actions", alignment: "end" },
          ]}
          promotedBulkActions={[
            {
              content: `Delete selected (${selectedResources.length})`,
              destructive: true,
              onAction: handleBulkDelete,
            },
          ]}
        >
          {rowMarkup}
        </IndexTable>

        {totalPages > 1 && (
          <Pagination
            label={`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredMappings.length)} of ${filteredMappings.length}`}
            hasPrevious={currentPage > 1}
            hasNext={currentPage < totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            type="table"
          />
        )}
      </Card>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description={
          deleteTargets.length > 1
            ? `Are you sure you want to delete ${deleteTargets.length} referrers?`
            : "Are you sure you want to delete this referrer?"
        }
      />
    </>
  );
}
