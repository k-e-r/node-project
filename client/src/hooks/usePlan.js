import { useSelector, useDispatch } from 'react-redux';
import {
  httpGetCategories,
  httpGetPlans,
  httpSubmitPlan,
  httpEditPlan,
  httpEditCategory,
  httpDeletePlan,
} from './request';
import { planDataActions } from '../store/planData-slice';
import { categoryListActions } from '../store/categoryList-slice';
import forgettingCurve from '../config';

const usePlan = () => {
  const dispatch = useDispatch();
  const startDate = useSelector((state) => state.searchDate.startDate);
  const endDate = useSelector((state) => state.searchDate.endDate);
  const category = [...useSelector((state) => state.categoryList.categoryList)];
  const color = [
    ...useSelector((state) => state.categoryList.categoryColorList),
  ];
  const planInfo = [...useSelector((state) => state.planData.planInfo)];

  const submitPlan = async (e) => {
    e.preventDefault();
    const timeOffset = new Date().getTimezoneOffset() / 60;
    const data = new FormData(e.target);
    const prevDate = new Date(data.get('plan-date'));
    const date = prevDate.setHours(prevDate.getHours() + timeOffset);
    const description = data.get('description');
    const category = data.get('category');
    const mode = data.get('mode') === null ? false : data.get('mode');
    const completed =
      data.get('completed') === null ? false : data.get('completed');
    const response = await httpSubmitPlan({
      date,
      description,
      category,
      mode,
      completed,
    });

    const success = response.ok;
    if (success) {
      const fetchedPlans = await httpGetPlans(startDate, endDate);
      dispatch(planDataActions.setPlanInfo({ planInfo: fetchedPlans.plan }));
    }

    let baseId;
    if (mode) {
      console.log('planInfo', data.get('plan-date'));
      planInfo.forEach((val) => {
        if (val.date.split('T')[0] === data.get('plan-date')) {
          if (val.category === category) {
            if (val.description === description) {
              baseId = val._id;
            }
          }
        }
      });

      const baseDate = date,
        baseDesc = description;
      forgettingCurve.forEach(async (val, times) => {
        const date = baseDate + val * 24 * 60 * 60 * 1000;
        const description = `${baseDesc} (${times + 1})`;
        await httpSubmitPlan({
          date,
          description,
          category,
          mode,
          completed,
          baseId,
          times,
        });
      });

      const fetchedPlans = await httpGetPlans(startDate, endDate);
      dispatch(planDataActions.setPlanInfo({ planInfo: fetchedPlans.plan }));
      console.log(fetchedPlans);
    }
    dispatch(planDataActions.setPlanFlg({ planSetFlg: false }));
  };

  const editPlan = async (e) => {
    e.preventDefault();
    const timeOffset = new Date().getTimezoneOffset() / 60;
    const data = new FormData(e.target);
    const _id = data.get('_id');
    const prevDate = new Date(data.get('plan-date'));
    const date = prevDate.setHours(prevDate.getHours() + timeOffset);
    const description = data.get('description');
    const category = data.get('category');
    const mode = data.get('mode') === null ? false : data.get('mode');
    const completed =
      data.get('completed') === null ? false : data.get('completed');
    const response = await httpEditPlan(_id, {
      date,
      description,
      category,
      mode,
      completed,
    });

    const success = response.ok;
    if (success) {
      const fetchedPlans = await httpGetPlans(startDate, endDate);
      dispatch(planDataActions.setPlanInfo({ planInfo: fetchedPlans.plan }));
    }
    dispatch(planDataActions.editPlanInfo({ planEditInfo: '' }));
  };

  const deletePlan = async ({ id }) => {
    const response = await httpDeletePlan(id);

    const success = response.ok;
    if (success) {
      const fetchedPlans = await httpGetPlans(startDate, endDate);
      dispatch(planDataActions.setPlanInfo({ planInfo: fetchedPlans.plan }));
    }
  };

  const editCategory = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let id,
      color = [],
      category = [];
    for (let d of data.entries()) {
      if (d[0] === '_id') id = d[1];
      else if (d[0] === 'category-color') color.push(d[1]);
      else if (d[0] === 'category-List') category.push(d[1]);
    }
    const response = await httpEditCategory(id, {
      category,
      color,
    });

    const success = response.ok;
    if (success) {
      const fetchedCategories = await httpGetCategories();
      dispatch(
        categoryListActions.setCategoryList(fetchedCategories.category[0])
      );
    }
    dispatch(
      categoryListActions.setCategoryEditFlg({ categoryEditFlg: false })
    );
  };

  const addCategory = async ({ id, categoryData, colorData }) => {
    category.push(categoryData);
    color.push(colorData);
    const response = await httpEditCategory(id, {
      category,
      color,
    });

    const success = response.ok;
    if (success) {
      const fetchedCategories = await httpGetCategories();
      dispatch(
        categoryListActions.setCategoryList(fetchedCategories.category[0])
      );
    }
  };

  const deleteCategory = async ({ id, delCategory }) => {
    const delIdx = category.findIndex((el) => el === delCategory);
    category.splice(delIdx, 1);
    color.splice(delIdx, 1);
    const response = await httpEditCategory(id, {
      category,
      color,
    });

    const success = response.ok;
    if (success) {
      const fetchedCategories = await httpGetCategories();
      dispatch(
        categoryListActions.setCategoryList(fetchedCategories.category[0])
      );
    }
  };

  return {
    submitPlan,
    editPlan,
    editCategory,
    addCategory,
    deleteCategory,
    deletePlan,
  };
};

export default usePlan;
