import { createCrudHooks } from "./use-crud";
import {
  departmentsApi,
  categoriesApi,
  emissionFactorsApi,
  productProfilesApi,
  goalsApi,
  policiesApi,
  badgesApi,
  rewardsApi,
} from "@/lib/api/master-data";

export const {
  useList: useDepartments,
  useCreate: useCreateDepartment,
  useUpdate: useUpdateDepartment,
  useDelete: useDeleteDepartment,
} = createCrudHooks("departments", departmentsApi);

export const {
  useList: useCategories,
  useCreate: useCreateCategory,
  useUpdate: useUpdateCategory,
  useDelete: useDeleteCategory,
} = createCrudHooks("categories", categoriesApi);

export const {
  useList: useEmissionFactors,
  useCreate: useCreateEmissionFactor,
  useUpdate: useUpdateEmissionFactor,
  useDelete: useDeleteEmissionFactor,
} = createCrudHooks("emission-factors", emissionFactorsApi);

export const {
  useList: useProductProfiles,
  useCreate: useCreateProductProfile,
  useUpdate: useUpdateProductProfile,
  useDelete: useDeleteProductProfile,
} = createCrudHooks("product-profiles", productProfilesApi);

export const {
  useList: useGoals,
  useCreate: useCreateGoal,
  useUpdate: useUpdateGoal,
  useDelete: useDeleteGoal,
} = createCrudHooks("goals", goalsApi);

export const {
  useList: usePolicies,
  useCreate: useCreatePolicy,
  useUpdate: useUpdatePolicy,
  useDelete: useDeletePolicy,
} = createCrudHooks("policies", policiesApi);

export const {
  useList: useBadges,
  useCreate: useCreateBadge,
  useUpdate: useUpdateBadge,
  useDelete: useDeleteBadge,
} = createCrudHooks("badges", badgesApi);

export const {
  useList: useRewards,
  useCreate: useCreateReward,
  useUpdate: useUpdateReward,
  useDelete: useDeleteReward,
} = createCrudHooks("rewards", rewardsApi);
